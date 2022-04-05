import PageControl from "../../core/PagedComponent/PageControl";
import PagedComponent from "../../core/PagedComponent/PagedComponent";
import { PagedComponentConfig, PagedComponentConfigDefaults } from "../../core/PagedComponent/PagedComponentConfig";
import TemplateLoader from "../../core/View/TemplateLoader";
import ControlTemplate from "./CarouselControl.html";

export default class Carousel extends PagedComponent {

	static className: string = "carousel";
	static defaultSelector?: string = ".carousel";

	constructor(element: HTMLElement, config: PagedComponentConfig = {}) {
		const cfg = { PagedComponentConfigDefaults, ...config };
		cfg.pageContainerSelector = ".slides";
		cfg.pageSelector = ".slide";

		super(element, cfg);

	}

	initControls(): void {
		if (!this.controls) this.controls = [];
		let controlElements = this.element.querySelectorAll(this._config.controlSelector);

		if (controlElements.length === 0) {
			const controlDOM = TemplateLoader.renderDOM(ControlTemplate, { totalPages: this.totalPages });
			let controlElements = controlDOM.querySelectorAll(this._config.controlSelector);
			for (const controlElement of controlElements) {
				this.element.appendChild(controlElement);
				this.controls.push(new PageControl(this, controlElement as HTMLElement));
			}
		}

		else {
			for (const controlElement of controlElements) {
				this.controls.push(new PageControl(this, controlElement as HTMLElement));
			}
		}

	}

}