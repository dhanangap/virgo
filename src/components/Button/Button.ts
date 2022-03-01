import Component from "../../core/Component/Component";
import TemplateLoader from "../../core/View/TemplateLoader";
import ButtonTemplate from "./Button.html";
import ButtonConfig, { ButtonConfigDefaults } from "./ButtonConfig";

export default class Button extends Component {

	static className: string = "button";
	static defaultSelector: string = "button";

	static create(config: ButtonConfig) {
		const element = TemplateLoader.renderDOM(ButtonTemplate, {
			label: config.label,
			classes: [
				config.variant ? config.variant : "",
				config.color ? config.color : "",
			].filter(el => el !== ""),
			leftIcon: config.leftIcon ? config.leftIcon : null,
			rightIcon: config.rightIcon ? config.rightIcon : null,
			icon: config.icon ? config.icon : null,
		});
		return new this(element.firstElementChild, config);
	}

	variant?: string;
	color?: string;

	clickHandlers?: Array<Function>;

	get label(): string {
		const element: HTMLElement = this.element.querySelector(".label");
		if (!element) return null;
		return element.innerText;
	}
	get icon(): string {
		const element: HTMLElement = this.element.querySelector(".icon.single");
		if (!element) return null;
		return element.innerText;
	}
	get leftIcon(): string {
		const element: HTMLElement = this.element.querySelector(".icon.left");
		if (!element) return null;
		return element.innerText;
	}
	get rightIcon(): string {
		const element: HTMLElement = this.element.querySelector(".icon.right");
		if (!element) return null;
		return element.innerText;
	}

	set label(value: string) {
		let element: HTMLElement = this.element.querySelector(".label");
		if (element) {
			element.innerText = value;
		}
	}
	set icon(value: string) {
		let element: HTMLElement = this.element.querySelector(".icon.single");
		if (element) {
			element.innerText = value;
		}
	}
	set leftIcon(value: string) {
		let element: HTMLElement = this.element.querySelector(".icon.left");
		if (element) {
			element.innerText = value;
		}
	}
	set rightIcon(value: string) {
		let element: HTMLElement = this.element.querySelector(".icon.right");
		if (element) {
			element.innerText = value;
		}
	}


	constructor(element: HTMLElement | Element | string, config: ButtonConfig = ButtonConfigDefaults) {
		let htmlElement: HTMLElement;
		if (typeof element === "string") {
			htmlElement = TemplateLoader.renderDOM(ButtonTemplate, {
				label: config.label,
				classes: [
					config.variant ? config.variant : "",
					config.color ? config.color : "",
				].filter(el => el !== ""),
				leftIcon: config.leftIcon ? config.leftIcon : null,
				rightIcon: config.rightIcon ? config.rightIcon : null,
				icon: config.icon ? config.icon : null,
			});
		}
		else htmlElement = element as HTMLElement;
		super(htmlElement, config);

		this.clickHandlers = [];

		this.element.addEventListener("click", () => {
			for (const handler of this.clickHandlers) {
				handler(this.element.dataset);
			}
		});
	}

	preventFocus(): void {
		this.element.addEventListener("mousedown", (event) => {
			event.preventDefault();
		});
	}

	addClickListener(handler: Function) {
		this.clickHandlers.push(handler);
	}

}