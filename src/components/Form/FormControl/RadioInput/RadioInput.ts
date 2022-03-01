import FormControl from "../FormControl";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";

export default class RadioInput extends FormControl {

	static className: string = "input-radio";
	static defaultSelector?: string = `input["radio"]`;

	get value(): string | null {
		const value = this._value;
		if (typeof value === "string") return value;
		else if (value) return value + "";
		else return null;
	}

	set value(value: string) {
		this._value = value;
		this.element.setAttribute("value", value);
	}

	get isChecked(): boolean {
		return (this.element as HTMLInputElement).checked;
	}

	set isChecked(value: boolean) {
		this.element.setAttribute("checked", value ? "true" : "false");
	}

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, {
			...config,
			type: config.type ? config.type : RadioInput.className,
		});
		if (!this.value) this.value = "";
	}

}