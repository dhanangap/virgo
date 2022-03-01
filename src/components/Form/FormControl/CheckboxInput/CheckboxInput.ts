import FormControl from "../FormControl";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";

export default class CheckboxInput extends FormControl {

	static className: string = "input-checkbox";
	static defaultSelector?: string = `input["checkbox"]`;

	element: HTMLInputElement;

	get value(): boolean {
		return this.element.checked;
	}

	set value(value: boolean) {
		this.isChecked = value;
	}

	get isChecked(): boolean {
		return this.element.checked;
	}

	set isChecked(value: boolean) {
		this._value = value;
		if (value) this.element.setAttribute("checked", "true");
		else this.element.removeAttribute("checked");
	}

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, {
			...config,
			type: config.type ? config.type : CheckboxInput.className,
		});
		if (!this.value) this.value = false;
	}

	toggle(): void {
		this.isChecked = !this.isChecked;
	}

}