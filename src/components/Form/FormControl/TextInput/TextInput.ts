import FormControl from "../FormControl";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";

export default class TextInput extends FormControl {

	static className: string = "input-text";
	static defaultSelector?: string = `input[type="text"]`;

	get value () : string | null {
		const value = this._value;
		if (typeof value === "string") return value;
		else if (value) return value + "";
		else return null;
	}

	set value (value: string) {
		this._value = value;
		this.element.setAttribute("value", value);
	}

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, {
			...config,
			type: config.type ? config.type : TextInput.className,
		});
		
		if (!this.value) this.value = "";

		// Value change listener
		this.element.addEventListener("input", (event: any) => {
			this.value = (event.target as HTMLInputElement).value;
		});
	}

}