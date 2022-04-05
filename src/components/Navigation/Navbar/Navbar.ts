import Component from "../../../core/Component/Component"
import { ComponentConfig, ComponentConfigDefaults } from "../../../core/Component/ComponentConfig";

export default class Navbar extends Component {
	static className: string = "navbar";
	static defaultSelector ?: string = ".navbar";

	constructor (element: HTMLElement, config: ComponentConfig = {}) {
		let cfg = { ...ComponentConfigDefaults, ...config };
		super(element, cfg);
		this.initEvents();
	}

	initEvents(): void {
		const menuTriggerButtons = this.element.querySelectorAll(".menu-trigger");
		for (const button of menuTriggerButtons) {
			const target = (button as HTMLElement).dataset["target"];
			button.addEventListener("click", () => {
				this.toggleMenu(button as HTMLElement, target);
			});
		}
	}

	toggleMenu(triggerButton?: HTMLElement, id?: string): void {
		let targetElement = ( id ? this.element.querySelector(`#${id}`) : this.element.querySelector(".menu") ) as HTMLElement;
		if (targetElement) {
			if (targetElement.classList.contains("open")) {
				targetElement.classList.remove("open");
			} else {
				targetElement.classList.add("open");
			}
		}
	}

	
}