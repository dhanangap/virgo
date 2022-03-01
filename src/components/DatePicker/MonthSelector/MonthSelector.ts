import CalendarDate from "../../../core/CalendarDate/CalendarDate";
import PagedComponent from "../../../core/PagedComponent/PagedComponent";
import { PagedComponentConfig } from "../../../core/PagedComponent/PagedComponentConfig";
import TemplateLoader from "../../../core/View/TemplateLoader";
import DatePicker from "../DatePicker";
import Template from "./MonthSelector.html";

export default class MonthSelector extends PagedComponent {

	static className: string = "month-selector";

	parent: DatePicker;
	onSelected?: Function;

	get selectedMonth(): CalendarDate {
		return this.parent.selectedMonth;
	}

	get selectedYear(): CalendarDate {
		return this.parent.selectedYear;
	}

	constructor(parent: DatePicker, element: HTMLElement, config: PagedComponentConfig = {}) {
		super(element as HTMLElement, {
			...config,
			transition: config.transition ? config.transition : "slide",
		});
		this.parent = parent;
		this.removeAllPages();
		this.addMonthSelectorPage(this.selectedYear.lastYear, 0);
		this.addMonthSelectorPage(this.selectedYear, 1);
		this.addMonthSelectorPage(this.selectedYear.nextYear, 2);
		this.activePageIndex = 1;
	}

	addMonthSelectorPage(year: CalendarDate, pageIndex: number = this.totalPages): void {
		let data: any = {};

		data.months = year.getMonthsInYear();
		data.selectedMonth = this.selectedMonth;

		const monthTemplate = TemplateLoader.renderDOM(Template, data).firstElementChild;
		this.addPage(pageIndex, monthTemplate);
		
		const monthButtons = monthTemplate.querySelectorAll(".month button");
		for (const button of monthButtons) {
			button.addEventListener("click", (event: any) => {
				event.preventDefault();
				if (this.onSelected) this.onSelected({
					year: parseInt((button as HTMLElement).dataset["year"]),
					month: parseInt((button as HTMLElement).dataset["month"]),
				});
			});
		}
	}

	update(): void {

		if (this.activePageIndex === 0) {
			this.removePage(2);
			this.addMonthSelectorPage(this.selectedYear.lastYear, 0);
			this.activePageIndex = 1;
		}

		else if (this.activePageIndex === 1) {
			// do nothing
		}

		else if (this.activePageIndex === 2) {
			this.removePage(0);
			this.addMonthSelectorPage(this.selectedYear.nextYear, 2);
			this.activePageIndex = 1;
		}

	}

}