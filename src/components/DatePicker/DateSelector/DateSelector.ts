import Template from "./DateSelector.html";
import DatePicker from "../DatePicker";
import PagedComponent from "../../../core/PagedComponent/PagedComponent";
import CalendarDate from "../../../core/CalendarDate/CalendarDate";
import { PagedComponentConfig } from "../../../core/PagedComponent/PagedComponentConfig";
import TemplateLoader from "../../../core/View/TemplateLoader";

export default class DateSelector extends PagedComponent {

	static className: string = "date-selector";

	parent: DatePicker;
	onSelected?: Function;

	today: Date;

	get selectedDate(): CalendarDate {
		return this.parent.selectedDate;
	}

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
		this.addDateSelectorPage(this.selectedMonth.lastMonth, 0);
		this.addDateSelectorPage(this.selectedMonth, 1);
		this.addDateSelectorPage(this.selectedMonth.nextMonth, 2);
		
		this.activePageIndex = 1;
	}

	addDateSelectorPage(month: CalendarDate, pageIndex: number = this.totalPages): void {
		let data: any = {};

		data.dates = month.getDatesInMonth();

		const firstDay = data.dates[0].day;
		const previousDaysCount = (firstDay === 0) ? (6) : (firstDay - 1);

		if (previousDaysCount > 0) {
			data.previousDates = month.lastMonth.getDatesInMonth(previousDaysCount * (-1));
		}

		const nextDaysCount = 42 - (data.dates.length + (data.previousDates ? data.previousDates.length : 0));
		if (nextDaysCount > 0) {
			data.nextDates = month.nextMonth.getDatesInMonth(nextDaysCount);
		}

		data.selectedDate = this.selectedDate;

		const dateTemplate = TemplateLoader.renderDOM(Template, data).firstElementChild;
		this.addPage(pageIndex, dateTemplate);

		const dateButtons = dateTemplate.querySelectorAll(".date button");
		for (const button of dateButtons) {
			button.addEventListener("click", (event) => {
				event.preventDefault();

				if (button.parentElement.classList.contains("previous")) {
					this.back();
				}
				
				else if (button.parentElement.classList.contains("next")) {
					this.forward();
				}

				else {
					for (const btn of dateButtons) {
						btn.classList.remove("selected");
					}
					button.classList.add("selected");
					if (this.onSelected) this.onSelected({
						year: parseInt((button as HTMLElement).dataset["year"]),
						month: parseInt((button as HTMLElement).dataset["month"]),
						date: parseInt((button as HTMLElement).dataset["date"]),
					});
				}
			});
		}
	}

	update(): void {
		
		if (this.activePageIndex === 0) {
			this.removePage(2);
			this.addDateSelectorPage(this.selectedMonth.lastMonth, 0);
			this.activePageIndex = 1;
		}

		else if (this.activePageIndex === 1) {
			// do nothing
		}

		else if (this.activePageIndex === 2) {
			this.removePage(0);
			this.addDateSelectorPage(this.selectedMonth.nextMonth, 2);
			this.activePageIndex = 1;
		}

	}

}