import CalendarDate from "../../../core/CalendarDate/CalendarDate";
import PagedComponent from "../../../core/PagedComponent/PagedComponent";
import { PagedComponentConfig } from "../../../core/PagedComponent/PagedComponentConfig";
import TemplateLoader from "../../../core/View/TemplateLoader";
import DatePicker from "../DatePicker";
import Template from "./YearSelector.html";

export default class YearSelector extends PagedComponent {

	static className: string = "year-selector";

	parent: DatePicker;
	medianYear: number;
	onSelected?: Function;

	get selectedYear(): CalendarDate {
		return this.parent.selectedYear;
	}

	constructor(parent: DatePicker, element: HTMLElement, config: PagedComponentConfig = {}) {
		super(element as HTMLElement, {
			...config,
			transition: config.transition ? config.transition : "slide",
		});
		this.parent = parent;
		this.medianYear = this.selectedYear.year;
		this.removeAllPages();
		this.addYearSelectorPage(new CalendarDate(this.selectedYear.year - 15), 0);
		this.addYearSelectorPage(this.selectedYear, 1);
		this.addYearSelectorPage(new CalendarDate(this.selectedYear.year + 15), 2);
		this.activePageIndex = 1;
	}

	addYearSelectorPage(year: CalendarDate, pageIndex: number = this.totalPages): void {
		let data: any = {};

		data.years = year.getYears(7,7);
		data.selectedYear = this.selectedYear;

		const yearTemplate = TemplateLoader.renderDOM(Template, data).firstElementChild;
		this.addPage(pageIndex, yearTemplate);
		const yearButtons = yearTemplate.querySelectorAll(".year button");

		for (const button of yearButtons) {
			button.addEventListener("click", (event) => {
				event.preventDefault();
				if (this.onSelected) this.onSelected({
					year: parseInt((button as HTMLElement).dataset["year"]),
				});
			});
		}
	}

	update(): void {

		if (this.activePageIndex === 0) {
			this.removePage(2);
			this.medianYear = this.medianYear - 15;
			this.addYearSelectorPage(new CalendarDate(this.medianYear - 15), 0);
			this.activePageIndex = 1;
		}

		else if (this.activePageIndex === 1) {
			// do nothing
		}

		else if (this.activePageIndex === 2) {
			this.removePage(0);
			this.medianYear = this.medianYear + 15;
			this.addYearSelectorPage(new CalendarDate(this.medianYear + 15), 2);
			this.activePageIndex = 1;
		}

	}

}