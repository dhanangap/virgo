import FormComponent from "../../FormComponent";
import FormControl from "../FormControl";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";

export default class Submit extends FormControl {

	static className: string = "submit";
	static defaultSelector?: string = `[type="submit"]`;

	form: FormComponent;

	constructor(form: FormComponent, element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, config);
		this.form = form;
	}

}