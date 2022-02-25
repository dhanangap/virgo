import PageDrag from "../Animation/PageDrag";
import PageTransition from "../Animation/PageTransition";
import Component from "../Component/Component";
import PageContainer from "./PageContainer";
import PageControl from "./PageControl";
import { PagedComponentConfig, PagedComponentConfigDefaults } from "./PagedComponentConfig";

/**
 * Class representing a component with multiple pages.
 */
export default class PagedComponent extends Component {

	static className: string = "paged-component";

	pageContainer: PageContainer;
	_activeIndex: number;
	_config: PagedComponentConfig;

	isTransitioning: boolean;
	isPaused: boolean;
	autoplayInterval?: NodeJS.Timer;

	controls: Array<PageControl>;
	externalControls: Array<PageControl>;
	pageDrag?: PageDrag;

	onActivePageChanged?: Function;

	/** Returns the total number of Pages. */
	get totalPages(): number {
		return this.pageContainer.pages.length;
	}

	/** Returns the index of currently active Page. */
	get activePageIndex(): number {
		return parseInt(this.element.dataset["active"]);
	}

	/** Set the index of active Page. */
	set activePageIndex(index: number) {
		const oldVal = this.activePageIndex;
		this.element.dataset["active"] = index.toString();
		this.pageContainer.updatePages();
		for (const control of this.controls) {
			control.updateButtons();
		}
		if (this.onActivePageChanged) this.onActivePageChanged(index, oldVal);
	}

	/** Returns Page transition name. */
	get transition(): string {
		return this.element.dataset["transition"];
	}

	/** Set Page transition. */
	set transition(value: string) {
		this.element.dataset["transition"] = value;
		this._config.transition = value;
	}

	/** Returns Page transition duration in miliseconds. */
	get transitionDuration(): number {
		return parseInt(this.element.dataset["transitionDuration"]);
	}

	/** Set Page transition duration in miliseconds. */
	set transitionDuration(value: number) {
		this.element.dataset["transitionDuration"] = value.toString();
	}

	/** Returns a boolean indicating whether autoplay is active or not. */
	get autoplay(): boolean {
		return this.element.dataset["autoplay"] === "true";
	}

	/** Set autoplay. */
	set autoplay(value: boolean | string) {
		let autoplayValue: boolean;
		if (typeof value === "string") autoplayValue = (value.toLowerCase() === "true");
		else autoplayValue = value;
		this.element.dataset["autoplay"] = autoplayValue ? "true" : "false";

	}

	/** Returns autoplay duration in miliseconds. */
	get autoplayDuration(): number {
		return parseInt(this.element.dataset["autoplayDuration"]);
	}

	/** Set duration before autoplay navigates to the next page, in miliseconds. */
	set autoplayDuration(value: number) {
		this.element.dataset["autoplayDuration"] = value.toString();
	}

	/** Return a boolean indicating whether the instance is draggable. */
	get draggable(): boolean {
		return this.element.dataset["draggable"] === "true";
	}

	/** Set draggable value. */
	set draggable(value: boolean | string) {
		let draggableValue: boolean;
		if (typeof value === "string") draggableValue = (value.toLowerCase() === "true");
		else draggableValue = value;
		this.element.dataset["draggable"] = draggableValue ? "true" : "false";

	}

	/**
	 * Creates new instance of this class.
	 * @param element - HTML DOM Element of this instance.
	 * @param config - Config of this instance.
	 */
	constructor(element: HTMLElement, config: PagedComponentConfig = {}) {
		super(element);

		this.initConfig(config);
		this.initPageContainer();
		this.initControls();
		this.initExternalControls();
		this.activePageIndex = this.element.dataset["active"] ? parseInt(this.element.dataset["active"]) : 0;

		if (this.transition !== "slide") this.draggable = false;
		if (this.draggable) {
			this.pageDrag = new PageDrag(this.pageContainer);
		}

		this.startAutoplay();
	}

	/** Initialize component configuration. */
	initConfig(config: any): void {
		const configuration = { ...this.element.dataset, ...config };
		this._config 			= PagedComponentConfigDefaults;
		this.transition 		= configuration["transition"] 			? configuration["transition"] 					: this._config["transition"];
		this.transitionDuration = configuration["transitionDuration"] 	? parseInt(configuration["transitionDuration"]) : this._config["transitionDuration"];
		this.autoplay 			= configuration["autoplay"] 			? configuration["autoplay"] 					: this._config["autoplay"];
		this.autoplayDuration 	= configuration["autoplayDuration"] 	? parseInt(configuration["autoplayDuration"]) 	: this._config["autoplayDuration"];
		this.draggable 			= configuration["draggable"] 			? configuration["draggable"] 					: this._config["draggable"];

		this.isTransitioning 	= false;
		this.isPaused 			= false;
	}

	/** Initialize PageContainer. */
	initPageContainer(): void {
		let pageContainerElement = this.element.querySelector(this._config.pageContainerSelector);

		if (!pageContainerElement) {
			pageContainerElement = document.createElement("div");
			pageContainerElement.setAttribute("class", this._config.pageContainerSelector.replace(".", ""));
			this.element.appendChild(pageContainerElement);
		};
		this.pageContainer = new PageContainer(this, pageContainerElement as HTMLElement);
	}

	/** Initialize PageControl inside the component. */
	initControls(): void {
		if (!this.controls) this.controls = [];
		const controlElements = this.element.querySelectorAll(this._config.controlSelector);
		for (const controlElement of controlElements) {
			this.controls.push(new PageControl(this, controlElement as HTMLElement));
		}
	}

	/** Initialize PageControl outside the component. */
	initExternalControls(): void {
		if (!this.controls) this.controls = [];
		const controlElements = document.querySelectorAll(`[data-control="#${this.id}"]`);

		for (const controlElement of controlElements) {
			this.controls.push(new PageControl(this, controlElement as HTMLElement));
		}
	}

	/** Start autoplay. */
	startAutoplay(): void {
		if (this.autoplay) {
			this.isPaused = false;
			this.autoplayInterval = setInterval(() => {
				if (!this.isPaused) this.forward();
			}, this.autoplayDuration);
		}
	}

	/** Stop autoplay. */
	stopAutoplay(): void {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
			this.isPaused = true;
		}
	}

	/** Reset autoplay. */
	resetAutoplay(): void {
		if (this.autoplay) {
			this.stopAutoplay();
			this.startAutoplay();
		}
	}

	/** Navigate to previous Page. */
	back(callback?: Function): void {
		this.goTo("back", callback);
	}

	/** Navigate to next Page. */
	forward(callback?: Function): void {
		this.goTo("forward", callback);
	}

	/**
	 * Navigate to specific Page index.
	 * @param index - Target page index.
	 * @param callback - Callback function to be called after transition.
	 */
	goTo(index: number | string, callback?: Function): void {
		let targetIndex: number;
		if (index === "back") targetIndex = this.pageContainer.previousPageIndex;
		else if (index === "forward") targetIndex = this.pageContainer.nextPageIndex;
		else if (typeof index === "number") targetIndex = index;
		else if (!isNaN(parseInt(index))) targetIndex = parseInt(index);
		else if (isNaN(parseInt(index))) {
			const targetPage = this.pageContainer.pages.find(page => page.id === index || `#${page.id}` === index);
			if (!targetPage) return;
			targetIndex = targetPage.index;
		}
		else return;

		if (this.activePageIndex === targetIndex) return;
		if (!this.pageContainer.pages[targetIndex]) return;

		if (this.transition !== "none") {
			let direction = 1;
			if (targetIndex < this.activePageIndex) direction = -1;
			if (index === "forward") direction = 1;
			if (index === "back") direction = -1;


			const transition = new PageTransition(this.pageContainer, this.activePageIndex, targetIndex, direction);

			if (this.transition === "slide") {
				transition.slide(this.transitionDuration, () => {
					this.activePageIndex = targetIndex;
					if (callback) callback();
				});
			}

			else if (this.transition === "fade") {
				transition.fade(this.transitionDuration, () => {
					this.activePageIndex = targetIndex;
					if (callback) callback();
				});
			}

		} else {
			this.activePageIndex = targetIndex;
			if (callback) callback();
		}

	}

	/** Add new children page. */
	addPage(index: number, element: HTMLElement | Element) {
		this.pageContainer.addPage(index, element);
	}

	/** Remove all children pages. */
	removeAllPages(): void {
		this.pageContainer.removeAllPages();
	}

	/**
	 * Remove specific children page.
	 * @param index - Index of the page to be removed.
	 */
	removePage(index: number): void {
		this.pageContainer.removePage(index);
	}

}