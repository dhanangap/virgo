import Component from "../Component/Component";
import PageControl from "./PageControl";

/** Class representing button of PageControl. */
export default class PageControlButton extends Component {

	parent: PageControl;
	target: number | string;

	/**
	 * Create new instance of this class.
	 * @param parent - PageControl component containing this instance.
	 * @param target - Index of the targeted page.
	 * @param element - HTML DOM Element of the button.
	 */
	constructor(parent: PageControl, target: number | string, element: HTMLElement) {
		super(element);
		this.parent = parent;
		this.target = target;
		this.element.dataset["target"] = target + "";
		this.initEvents();
		this.update();
	}

	/**
	 * Initialize event listener of the button element.
	 * */
	initEvents(): void {
		this.element.addEventListener("click", () => {
			this.parent.targetComponent.goTo(this.target);
			this.parent.targetComponent.resetAutoplay();
		});
	}

	/**
	 * Update button to reflect real-time conditions.
	 */
	update(): void {
		const index = typeof this.target === "number" ? this.target : parseInt(this.target);
		if (!isNaN(index)) {
			this.element.classList.remove("active");
			if (index === this.parent.targetComponent.activePageIndex) this.element.classList.add("active");
		}
	}

}