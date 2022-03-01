import { FormLabelConfig } from "./FormLabelConfig";
import Template from "./FormLabel.html";
import Component from "../../../core/Component/Component";
import TemplateLoader from "../../../core/View/TemplateLoader";

export default class FormLabel extends Component {

	static className: string = "form-label";
	static defaultSelector?: string = "form label";

	iconElement: HTMLElement;
	textElement: HTMLElement;

	get icon(): string {
		if (this.iconElement) return this.iconElement.innerText;
		return "";
	}

	set icon(value: string) {
		this.iconElement.innerText = value;
	}

	get text(): string {
		if (this.textElement) return this.textElement.innerText;
		return "";
	}

	set text(value: string) {
		this.textElement.innerText = value;
	}

	constructor(element: HTMLElement | null, config: FormLabelConfig = {}) {
		if (element === null) {
			super(TemplateLoader.renderDOM(Template, config));
		}
		super(element, config);
		
		// Icon element initialization
		this.iconElement = this.element.querySelector("span.icon");
		if (!this.iconElement) {
			this.iconElement = document.createElement("span");
			this.iconElement.classList.add("icon");
			this.element.appendChild(this.iconElement);
		}
		
		// Text element initialization
		this.textElement = this.element.querySelector("span.text");
		if (!this.textElement) {
			this.textElement = document.createElement("span");
			this.textElement.classList.add("text");
			this.element.appendChild(this.textElement);
		}
	}

}