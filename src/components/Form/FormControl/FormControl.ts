import Component from "../../../core/Component/Component";
import FormControlConfig, { FormControlConfigDefaults } from "./FormControlConfig";

export default class FormControl extends Component {
	[x: string]: any;

	static className: string = "form-control";
	static defaultSelector?: string = ".form-control";

	type?: string;
	name?: string;
	_value?: any;
	isRequired: boolean;

	containerElement?: HTMLElement;

	labelElement?: HTMLLabelElement;
	labelText?: string;
	placeholderText?: string;

	set value (value: any) {
		this._value = value;
		this.element.setAttribute("value", value + "");
	}

	get value () : any {
		return this._value;
	}

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, config);
		
		this.isRequired = config.isRequired ? config.isRequired : false;
		this.type = config.type ? config.type : "";
		
		// { value } property
		if (config.value) this.value = config.value;
		else {
			if (this.element.getAttribute("value")) {
				this.value = this.element.getAttribute("value");
			}
		}
		
		// { name } property
		if (config.name) this.name = config.name;
		else {
			if (this.element.getAttribute("name")) {
				this.name = this.element.getAttribute("name");
			}
		}

		// Container
		this.initContainer();
		// Label
		if (this.element.dataset["label"]) this.initLabel();
		if (config.placeholder) {
			this.placeholderText = config.placeholder;
		} else {
			this.placeholderText = this.element.getAttribute("placeholder") ? this.element.getAttribute("placeholder") : "";
		}
	}

	initContainer() : void {
		if (this.element.parentElement.classList.contains(FormControl.className)) {
			this.containerElement = this.element.parentElement;
		}
		else {
			this.containerElement = document.createElement("div");
			this.containerElement.classList.add(FormControl.className);
			if (this.type && this.type !== "") this.containerElement.classList.add(this.type);
			this.element.parentElement.insertBefore(this.containerElement, this.element);
			this.containerElement.appendChild(this.element);
		}
	}

	initLabel() : void {
		let text = this.element.dataset["label"];
		this.labelText = text;
		if (!this.labelElement) {
			this.labelElement = document.createElement("label");
			this.labelElement.innerText = this.labelText;
			this.element.parentElement.insertBefore(this.labelElement, this.element);
		}
		this.labelElement.addEventListener("click", () => {
			if (this.type === "input-radio") {
				(this.element as HTMLInputElement).checked = true;
			}
			else if (this.type === "input-checkbox") {
				this.toggle();
			}
			else {
				this.element.focus();
			}
		});
	}

	hideElement(): void {
		this.element.style.display = "none";
	}

	unhideElement(): void {
		this.element.style.display = null;
	}

}