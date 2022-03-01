import FormControl from "./FormControl/FormControl";
import PasswordInput from "./FormControl/PasswordInput/PasswordInput";
import SearchInput from "./FormControl/SearchInput/SearchInput";
import DateInput from "./FormControl/DateInput/DateInput";
import SelectInput from "./FormControl/SelectInput/SelectInput";
import Submit from "./FormControl/Submit/Submit";
import TextInput from "./FormControl/TextInput/TextInput";
import FormData from "./FormData";
import RadioInput from "./FormControl/RadioInput/RadioInput";
import CheckboxInput from "./FormControl/CheckboxInput/CheckboxInput";
import Component from "../../core/Component/Component";
import { ComponentConfig, ComponentConfigDefaults } from "../../core/Component/ComponentConfig";
import CalendarDate from "../../core/CalendarDate/CalendarDate";

/**
 * Virgo Library
 * FormComponent Class
 * Author: Dhanang (https://github.com/dhanangap)
 */
export default class FormComponent extends Component {

	static className: string = "form";
	static defaultSelector?: string = "form";

	submitTrigger?: Submit;
	onSubmit?: Function;

	controls: Array<FormControl>;

	get data () : FormData {
		let data: FormData = {};
		for (const control of this.controls) {
			if (control.name) {

				if (control.type === "input-radio") {
					if (!data[control.name]) data[control.name] = undefined;
					if ((control as RadioInput).isChecked) data[control.name] = control.value;
				}

				else if (control.type === "input-date") {
					if (control.value) {
						data[control.name] = CalendarDate.createFromDate(control.value).format("yyyy-mm-dd");
					} else {
						data[control.name] = "";
					}
				}

				else {
					data[control.name] = control.value;
				}

			}
		}
		return data;
	}

	constructor(element: HTMLElement | Element | string, config: ComponentConfig = ComponentConfigDefaults) {
		super(element, config);
		this.initSubmitTrigger();
		this.initControls();
	}

	initSubmitTrigger() : void {
		const submitElement = this.element.querySelector(Submit.defaultSelector);
		if (submitElement) {
			this.submitTrigger = new Submit(this, submitElement);
			this.element.addEventListener("submit", (event) => {
				if (this.onSubmit) {
					event.preventDefault();
					this.onSubmit(this.data);
				}
			});
		}
	}

	initControls() : void {
		this.controls = [];
		let control;
		const controlElements = this.element.querySelectorAll("input, textarea, select");
		for (const controlElement of controlElements) {
			const nodeName = controlElement.nodeName.toLowerCase();
			// Input
			if (nodeName === "input") {
				const type = controlElement.getAttribute("type");
				if (type === "text") control = new TextInput(controlElement);
				else if (type === "password") control = new PasswordInput(controlElement);
				else if (type === "search") control = new SearchInput(controlElement);
				else if (type === "date") control = new DateInput(controlElement);
				else if (type === "radio") control = new RadioInput(controlElement);
				else if (type === "checkbox") control = new CheckboxInput(controlElement);
			}
			// Select
			else if (nodeName === "select") {
				control = new SelectInput(controlElement);
			}

			// Add to control list
			this.controls.push(control);
		}
		
	}

	submit () : void {

	}

}