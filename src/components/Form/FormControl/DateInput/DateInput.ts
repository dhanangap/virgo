import CalendarDate from "../../../../core/CalendarDate/CalendarDate";
import TemplateLoader from "../../../../core/View/TemplateLoader";
import DatePicker from "../../../DatePicker/DatePicker";
import Popper from "../../../Popper/Popper";
import FormControl from "../FormControl";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";
import Template from "./DateInput.html";

export default class DateInput extends FormControl {

	static className: string = "input-date";
	static defaultSelector?: string = `input[type="date"]`;

	placeholderText?: string;
	controlElement: HTMLElement;
	datepicker: DatePicker;
	popper: Popper;

	set value(value: Date | string) {
		if (value) {
			if (typeof value === "string" && value !== "") {
				const year = parseInt(value.split("-")[0]);
				const month = parseInt(value.split("-")[1]) - 1;
				const date = parseInt(value.split("-")[2]);
				this._value = new Date(year, month, date);
			} else {
				this._value = value;
			}
			this.element.setAttribute("value", CalendarDate.createFromDate((this._value as Date)).format("yyyy-mm-dd"));
			if (this.controlElement) {
				let valueLabel = this.controlElement.querySelector("span.value");
				let placeholderLabel = this.controlElement.querySelector("span.placeholder");

				if (this._value) {
					if (!valueLabel) {
						valueLabel = document.createElement("span");
						valueLabel.classList.add("value");
						const icon = this.controlElement.querySelector("span.icon");
						icon.before(valueLabel);
					}
					valueLabel.innerHTML = CalendarDate.createFromDate(this.value).format("yyyy-mm-dd");
					if (placeholderLabel) placeholderLabel.remove();
				}

				else {
					if (!placeholderLabel) {
						placeholderLabel = document.createElement("span");
						placeholderLabel.classList.add("placeholder");
						const icon = this.controlElement.querySelector("span.icon");
						icon.before(placeholderLabel);
					}
					placeholderLabel.innerHTML = this.placeholderText;
					if (valueLabel) valueLabel.remove();
				}
			}
		}
	}

	get value(): Date {
		return this._value;
	}

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, {
			...config,
			type: config.type ? config.type : DateInput.className,
		});
		this.element.setAttribute("type", "date");

		this.initControlElement();
		this.initDatePicker();
		this.initEvents();
	}

	initControlElement(): void {
		this.controlElement = TemplateLoader.renderDOM(Template, {
			placeholder: this.placeholderText,
			value: this.value ? CalendarDate.createFromDate(this.value).format("yyyy-mm-dd") : null,
		}).firstElementChild as HTMLElement;
		this.element.after(this.controlElement);
		this.element.style.display = `none`;
	}

	initDatePicker(): void {
		let datepickerElement = document.createElement("div");
		datepickerElement.classList.add("datepicker");
		this.controlElement.after(datepickerElement);
		this.datepicker = new DatePicker(datepickerElement, {}, this.value);
		this.datepicker.onValueChanged = (newValue: Date) => {
			this.value = newValue;
			if (this.popper) this.popper.hide();
		}
		this.popper = new Popper(this.controlElement, this.datepicker.element, {
			position: "bottom",
			width: this.datepicker.element.getBoundingClientRect().width,
		});
		this.popper.onHide = () => {
			this.datepicker.openDateSelectorPage();
		}
	}

	initEvents(): void {
		this.controlElement.addEventListener("click", () => {
			this.popper.toggle();
		});
	}

}