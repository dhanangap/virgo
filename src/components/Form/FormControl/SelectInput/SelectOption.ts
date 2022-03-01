import Component from "../../../../core/Component/Component";
import TemplateLoader from "../../../../core/View/TemplateLoader";
import Option from "./Option";
import SelectInput from "./SelectInput";
import Template from "./SelectOption.html";

export default class SelectOption extends Component {

	parent: SelectInput;
	option: Option;
	clickEvents: Array<Function>;

	constructor(parent: SelectInput, option: Option = {}) {
		const element = TemplateLoader.renderDOM(Template, {
			...option,
			selectedIndex: parent.selectedOptionIndex,
		}).firstElementChild;
		super(element);
		this.parent = parent;
		this.option = option;
		this.refreshElement();
		this.initEvents();
	}

	refreshElement(): void {
		this.element.classList.remove("selected");
		if (this.parent.selectedOptionIndex === this.option.index) {
			this.element.classList.add("selected");
		}
	}

	initEvents(): void {
		this.clickEvents = [];
		this.element.addEventListener("mousedown", () => {
			this.clickEvents.forEach(handler => {
				handler();
			});
		});
	}

	addClickListener(handler: Function) {
		this.clickEvents.push(handler);
	};

}