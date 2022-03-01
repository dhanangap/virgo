import Button from "../../../Button/Button";
import FormControlConfig, { FormControlConfigDefaults } from "../FormControlConfig";
import TextInput from "../TextInput/TextInput";

export default class SearchInput extends TextInput {

	static className: string = "input-search";
	static defaultSelector?: string = `input[type="search"]`;

	searchButton?: Button;

	constructor(element: HTMLElement | Element | string, config: FormControlConfig = FormControlConfigDefaults) {
		super(element, {
			...config,
			type: config.type ? config.type : SearchInput.className,
		});
		this.element.setAttribute("type", "text");
		this.initSearchButton();
	}

	initSearchButton() : void {
		this.searchButton = Button.create({
			icon: "search",
			variant: "transparent"
		});
		this.element.after(this.searchButton.element);
	}

}