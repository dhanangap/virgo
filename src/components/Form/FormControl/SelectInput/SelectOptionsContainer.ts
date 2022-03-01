import Component from "../../../../core/Component/Component";
import TemplateLoader from "../../../../core/View/TemplateLoader";
import SelectInput from "./SelectInput";
import SelectOption from "./SelectOption";
import Template from "./SelectOptionsContainer.html";

export default class SelectOptionsContainer extends Component {
	
	parent: SelectInput;
	items: Array<SelectOption>;
	
	constructor(parent: SelectInput) {
		const element = TemplateLoader.renderDOM(Template, {
			options: parent.options
		}).firstElementChild;
		super(element);
		this.parent = parent;
		this.initOptionElements();
	}

	initOptionElements(): void {
		this.items = [];
		for (const option of this.parent.options) {
			const item = new SelectOption(this.parent, option);
			item.addClickListener(() => {
				this.parent.select(option.index);
			});
			this.items.push(item);
			this.element.appendChild(item.element);
		}
	}

	refresh(): void {
		this.items.forEach(item => {
			item.refreshElement();
		});
	}

}