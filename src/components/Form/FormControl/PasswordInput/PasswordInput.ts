import Button from "../../../Button/Button";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";
import TextInput from "../TextInput/TextInput";

export default class PasswordInput extends TextInput {

	static className: string = "input-password";
	static defaultSelector?: string = `input[type="password"]`;

	toggleButton?: Button;

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, {
			...config,
			type: config.type ? config.type : PasswordInput.className,
		});
		this.initToggleButton();
	}

	initToggleButton() : void {
		this.toggleButton = Button.create({
			icon: "visibility",
			variant: "transparent"
		});
		this.element.after(this.toggleButton.element);

		this.toggleButton.addClickListener(() => {
			this.toggleVisibility();
		});
	}

	toggleVisibility() : void {
		if (this.element.getAttribute("type") === "password") {
			this.element.focus();
			this.element.setAttribute("type", "text");
			this.toggleButton.icon = "visibility_off";
		}
		else if (this.element.getAttribute("type") === "text") {
			this.element.focus();
			this.element.setAttribute("type", "password");
			this.toggleButton.icon = "visibility";
		}
	}

}