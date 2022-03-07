import Component from "../../../core/Component/Component";
import { ComponentConfig } from "../../../core/Component/ComponentConfig";
import ScrollspyTarget from "./ScrollspyTarget";

/**
 * Class representing a component that acts as indicator in which section
 * the page is currently now when being scrolled.
 */
export default class Scrollspy extends Component {

	static className: string = "scrollspy";
	static defaultSelector?: string = ".scrollspy";

	targetElement: HTMLElement;
	targetIds: ScrollspyTarget;
	currentId: string | null;

	/**
	 * Creates a new Scrollspy element.
	 * @param element - HTML DOM Element of the component.
	 * @param targetElement - HTML DOM Element of the target that will be monitored.
	 * @param config - Component configuration.
	 */
	constructor (element: HTMLElement | Element, config?: ComponentConfig) {
		super(element);
		this.targetElement = this.element.dataset["target"] ? document.querySelector(this.element.dataset["target"]) : document.querySelector("html");
		this.targetElement = this.targetElement ? this.targetElement : document.querySelector("html");
		
		this.currentId = null;
		this.targetIds = this.extractTargetIds();

		this.targetElement.addEventListener("scroll", () => {
			this.scrollHandler(this.targetElement.scrollTop);
		});
		this.targetElement.dispatchEvent(new CustomEvent("scroll"));
		this.targetElement.style.scrollBehavior = "smooth";
		
	}

	/**
	 * Extracting target ids that will be monitored and retrieving their respective locations.
	 * @returns the list of ids and location in format { "id": location }
	 */
	extractTargetIds (): ScrollspyTarget {
		let targetIds: ScrollspyTarget = {};
		
		const links 		= this.element.querySelectorAll("a");
		const button 		= this.element.querySelectorAll("button");
		const containerTop 	= this.targetElement.getBoundingClientRect().top;

		for (const link of links) {
			if (link.hasAttribute("href")) {
				const href 			= link.getAttribute("href");
				const id			= link.hash;
				const isOtherPage 	= (href !== "#") && ((link.pathname !== window.location.pathname) && (link.pathname + '/' !== window.location.pathname));
				const target		= (id && id !== "") ? this.targetElement.querySelector(id) : null;
				
				if (!isOtherPage && id && target) {
					const targetTop = target.getBoundingClientRect().top;
					const targetHeight = target.getBoundingClientRect().height;
					targetIds[id] = {
						element: link as HTMLElement,
						top: targetTop - containerTop,
						left: 0,
						height: targetHeight,
						width: 0,
					};
				}
				
			}
		}

		return targetIds;
	}

	scrollHandler(scrollTop: number): void {
		for (const id of Object.keys(this.targetIds)) {
			// Scrolling inside range
			if (
				scrollTop >= this.targetIds[id].top &&
				scrollTop <= this.targetIds[id].top + this.targetIds[id].height
			) {
				if (this.currentId !== id) {
					this.targetIds[id].element.classList.add("active");
					this.currentId = id;
				}
			}
			// Scrolling outside range
			else {
				this.targetIds[id].element.classList.remove("active");
				this.currentId = null;
			}
		}
	}

}