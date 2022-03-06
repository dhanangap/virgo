import PagedComponent from "../../core/PagedComponent/PagedComponent";
import { PagedComponentConfig } from "../../core/PagedComponent/PagedComponentConfig";

export default class Tab extends PagedComponent {

	static className: string = "tab";
	static defaultSelector?: string = ".tab";

	constructor(element: HTMLElement, config: PagedComponentConfig = {}) {
		const tabConfig = { ...element.dataset, ...config };
		super(element, {
			...tabConfig,
			transition: tabConfig.transition ? tabConfig.transition : "slide",
			pageContainerSelector: tabConfig.pageContainerSelector ? tabConfig.pageContainerSelector : ".tab-pages",
			pageSelector: tabConfig.pageSelector ? tabConfig.pageSelector : ".tab-page",
			controlSelector: tabConfig.controlSelector ? tabConfig.controlSelector : ".tab-nav",
		});
	}
}