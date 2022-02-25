import Component from "../Component/Component";
import PageControlButton from "./PageControlButton";
import PagedComponent from "./PagedComponent";

/** Class representing the control of PagedComponent. */
export default class PageControl extends Component {

	targetComponent: PagedComponent;
	buttons: Array<PageControlButton>;

	/**
	 * Create new instance of this class.
	 * @param targetComponent - A PagedComponent instance to be controlled.
	 * @param element - HTML DOM Element of this instance.
	 */
	constructor(targetComponent: PagedComponent, element: HTMLElement) {
		super(element);
		this.targetComponent = targetComponent;
		this.initButtons();
	}

	/**
	 * Convert buttons inside this element as PageControlButton instances.
	 */
	initButtons(): void {
		this.buttons = [];
		const buttons = this.element.querySelectorAll("button");

		let indexedButtons: Array<HTMLElement> = [];
		let unindexedButtons: Array<HTMLElement> = [];

		for (const button of buttons) {
			if (button.hasAttribute("data-target")) indexedButtons.push(button);
			else unindexedButtons.push(button);
		}
		// Convert buttons without target index as indicator buttons.
		for (let index = 0; index < unindexedButtons.length; index++) {
			const button = unindexedButtons[index];
			this.buttons.push(new PageControlButton(this, index, button));
		}
		// Convert buttons with target index as navigation buttons.
		for (const button of indexedButtons) {
			this.buttons.push(new PageControlButton(this, button.dataset["target"], button));
		}

	}

	/**
	 * Update all buttons to reflect real-time conditions.
	 */
	updateButtons(): void {
		for (const button of this.buttons) {
			button.update();
		}
	}

}