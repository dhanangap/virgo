import FormControl from "../FormControl";
import SelectInputConfig from "./SelectInputConfig";
import SelectOptionsContainer from "./SelectOptionsContainer";
import Option from "./Option";
import Template from "./SelectInput.html";
import TemplateLoader from "../../../../core/View/TemplateLoader";
import Popper from "../../../Popper/Popper";

export default class SelectInput extends FormControl {

	static className: string = `input-select`;
	static defaultSelector?: string = `select`;

	placeholderText?: string;
	controlElement: HTMLElement;

	options: Array<Option>;
	optionsContainer: SelectOptionsContainer;
	popper: Popper;

	selectedOptionIndex?: number;

	get selectedOption(): Option {
		if (!this.options) return null;
		return this.options[this.selectedOptionIndex];
	}

	constructor(element: HTMLElement | Element, config: SelectInputConfig = {}) {
		super(element as HTMLElement, {
			...config,
			type: SelectInput.className,
		});
		this.placeholderText = config.placeholder ? config.placeholder : this.element.getAttribute("placeholder");
		this.initControlElement();
		this.initOptions(config);
		this.initEvents();
	}

	initControlElement(): void {
		this.controlElement = TemplateLoader.renderDOM(Template, {
		placeholder: this.placeholderText,
			selected: this.selectedOption,
		}).firstElementChild as HTMLElement;
		this.element.after(this.controlElement);
		this.element.style.display = `none`;
	}

	refreshControl(): void {
		this.controlElement.innerHTML = TemplateLoader.renderDOM(Template, {
			placeholder: this.placeholderText,
			selected: this.selectedOption,
		}).firstElementChild.innerHTML;
	}

	initOptions(config: SelectInputConfig = {}): void {
		this.options = config.options ? config.options : [];
		if (this.options.length === 0) {
			const optionElements = this.element.querySelectorAll("option");
			for (const element of optionElements) {
				const label = element.innerText;
				const value = element.value ? element.value : element.innerText;
				const icon 	= element.dataset["icon"] ? element.dataset["icon"] : null;
				this.options.push({ label, value, icon, index: this.options.length });
			}
		}

		
		this.optionsContainer = new SelectOptionsContainer(this);
		this.controlElement.after(this.optionsContainer.element);
		
		const selectedOption = this.options.find(option => option.value === this.value);
		if (selectedOption) this.select(selectedOption.index);

		this.popper = new Popper(this.controlElement, this.optionsContainer.element, {
			position: "bottom",
		});
	}

	initEvents(): void {
		this.controlElement.addEventListener("click", () => {
			this.popper.toggle();
		});
		this.controlElement.addEventListener("blur", () => {
			this.popper.hide();
		});
	}

	select(index: number): void {
		const option = this.options[index];
		this.value = option.value;
		this.selectedOptionIndex = index;
		this.refreshControl();
		this.optionsContainer.refresh();
	}

}