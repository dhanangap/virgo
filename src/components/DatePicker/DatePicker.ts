import CalendarDate from "../../core/CalendarDate/CalendarDate";
import PagedComponent from "../../core/PagedComponent/PagedComponent";
import { PagedComponentConfig } from "../../core/PagedComponent/PagedComponentConfig";
import TemplateLoader from "../../core/View/TemplateLoader";
import Button from "../Button/Button";
import Template from "./DatePicker.html";
import DateSelector from "./DateSelector/DateSelector";
import MonthSelector from "./MonthSelector/MonthSelector";
import YearSelector from "./YearSelector/YearSelector";

export default class DatePicker extends PagedComponent {

	static className: string = `datepicker`;
	static defaultSelector: string = `.datepicker`;

	_value?: Date;
	onValueChanged?: Function;

	selectedDate: CalendarDate;
	selectedMonth: CalendarDate;
	selectedYear: CalendarDate;

	dateSelectorPage?: HTMLElement;
	monthSelectorPage?: HTMLElement;
	yearSelectorPage?: HTMLElement;

	dateSelector?: DateSelector;
	monthSelector?: MonthSelector;
	yearSelector?: YearSelector;

	monthSelectorButton?: Button;
	yearSelectorButton?: Button;

	get value(): Date {
		return this._value;
	}

	set value(value: Date) {
		this._value = value;
		if (this.onValueChanged) this.onValueChanged(this._value);
	}

	constructor(element: HTMLElement, config: PagedComponentConfig = {}, value?: Date) {
		const datepickerElement = TemplateLoader.renderDOM(Template).firstElementChild;

		element.after(datepickerElement);
		element.remove();
		element = datepickerElement as HTMLElement;
		super(datepickerElement as HTMLElement, {
			...config,
			transition: config.transition ? config.transition : "fade",
			pageContainerSelector: config.pageContainerSelector ? config.pageContainerSelector : ".pages",
			pageSelector: config.pageSelector ? config.pageSelector : ".page",
		});
		if (value) {
			this._value = value;
		}
		
		this.initValues();
		this.openDateSelectorPage();
	}

	initValues() {

		this.selectedDate = this.value ? CalendarDate.createFromDate(this.value) : CalendarDate.createFromDate(new Date());
		this.selectedMonth = this.selectedDate;
		this.selectedYear = this.selectedDate;

	}

	initDateSelectorPage(): void {
		
		if (this.dateSelectorPage) this.dateSelectorPage.innerHTML = "";
		this.dateSelectorPage = this.element.querySelector(".page.date-selector");

		let pageHeader = document.createElement("header");

		let pageContainer = document.createElement("div");
		pageContainer.classList.add("page-container");

		this.dateSelectorPage.appendChild(pageHeader);
		this.dateSelectorPage.appendChild(pageContainer);

		this.dateSelector = new DateSelector(this, this.dateSelectorPage, {});
		
		this.dateSelector.onSelected = (event: any) => {
			this.selectedDate = new CalendarDate(event.year, event.month, event.date);
			this.value = this.selectedDate.toDate();
		};

		this.dateSelector.onActivePageChanged = (newVal: number, oldVal: number) => {
			if (newVal === 0) {
				this.selectedMonth = this.selectedMonth.lastMonth;
				if (this.selectedMonth.year !== this.selectedYear.year) {
					this.selectedYear = new CalendarDate(this.selectedMonth.year, 0, 1);
				}
				this.monthSelectorButton.label = this.selectedMonth.format("MM yyyy");
				this.dateSelector.update();
			}
			else if (newVal === 2) {
				this.selectedMonth = this.selectedMonth.nextMonth;
				if (this.selectedMonth.year !== this.selectedYear.year) {
					this.selectedYear = new CalendarDate(this.selectedMonth.year, 0, 1);
				}
				this.monthSelectorButton.label = this.selectedMonth.format("MM yyyy");
				this.dateSelector.update();
			}
		}

		this.monthSelectorButton = Button.create({
			label: this.selectedMonth.format("MM yyyy"),
		});
		if (this.monthSelectorButton) {
			this.monthSelectorButton.addClickListener(() => {
				this.openMonthSelectorPage();
			});
		}
		
		const backButton = Button.create({
			icon: "arrow_back",
		});
		if (backButton) backButton.addClickListener(() => {
			this.dateSelector.back();
		});
		
		const forwardButton = Button.create({
			icon: "arrow_forward",
		});
		if (forwardButton) forwardButton.addClickListener(() => {
			this.dateSelector.forward();
		});
		
		pageHeader.appendChild(backButton.element);
		pageHeader.appendChild(this.monthSelectorButton.element);
		pageHeader.appendChild(forwardButton.element);
	}

	initMonthSelectorPage(): void {

		if (this.monthSelectorPage) this.monthSelectorPage.innerHTML = "";
		this.monthSelectorPage = this.element.querySelector(".page.month-selector");

		let pageHeader = document.createElement("header");
		
		let pageContainer = document.createElement("div");
		pageContainer.classList.add("page-container");

		this.monthSelectorPage.appendChild(pageHeader);
		this.monthSelectorPage.appendChild(pageContainer);

		this.monthSelector = new MonthSelector(this, this.monthSelectorPage, {});
		this.monthSelector.onSelected = (event: any) => {
			this.selectedMonth = new CalendarDate(event.year, event.month, 1);
			this.openDateSelectorPage();
		};

		this.monthSelector.onActivePageChanged = (newVal: number) => {
			if (newVal === 0) {
				this.selectedYear = this.selectedYear.lastYear;
				this.yearSelectorButton.label = this.selectedYear.format("yyyy");
				this.monthSelector.update();
			}
			else if (newVal === 2) {
				this.selectedYear = this.selectedYear.nextYear;
				this.yearSelectorButton.label = this.selectedYear.format("yyyy");
				this.monthSelector.update();
			}
		}

		this.yearSelectorButton = Button.create({
			label: this.selectedYear.format("yyyy"),
		});
		if (this.yearSelectorButton) {
			this.yearSelectorButton.addClickListener(() => {
				this.openYearSelectorPage();
			});
		}

		const backButton = Button.create({
			icon: "arrow_back",
		});
		if (backButton) backButton.addClickListener(() => {
			this.monthSelector.back();
		});

		const forwardButton = Button.create({
			icon: "arrow_forward",
		});
		if (forwardButton) forwardButton.addClickListener(() => {
			this.monthSelector.forward();
		});

		pageHeader.appendChild(backButton.element);
		pageHeader.appendChild(this.yearSelectorButton.element);
		pageHeader.appendChild(forwardButton.element);
	}

	initYearSelectorPage(): void {

		if (this.yearSelectorPage) this.yearSelectorPage.innerHTML = "";
		this.yearSelectorPage = this.element.querySelector(".page.year-selector");

		let pageHeader = document.createElement("header");

		let pageContainer = document.createElement("div");
		pageContainer.classList.add("page-container");

		this.yearSelectorPage.appendChild(pageHeader);
		this.yearSelectorPage.appendChild(pageContainer);

		this.yearSelector = new YearSelector(this, this.yearSelectorPage, {});
		
		this.yearSelector.onSelected = (event: any) => {
			this.selectedYear = new CalendarDate(event.year, 0, 1);
			this.openMonthSelectorPage();
		};

		this.yearSelectorButton = Button.create({
			label: "Year",
		});

		const backButton = Button.create({
			icon: "arrow_back",
		});
		if (backButton) backButton.addClickListener(() => {
			this.yearSelector.back(() => {
				// this.selectedYear = this.selectedYear.lastYear;
				// this.yearSelectorButton.label = this.selectedYear.format("yyyy");
				this.yearSelector.update();
			});
		});

		const forwardButton = Button.create({
			icon: "arrow_forward",
		});
		if (forwardButton) forwardButton.addClickListener(() => {
			this.yearSelector.forward(() => {
				// this.selectedYear = this.selectedYear.nextYear;
				// this.yearSelectorButton.label = this.selectedYear.format("yyyy");
				this.yearSelector.update();
			});
		});

		pageHeader.appendChild(backButton.element);
		pageHeader.appendChild(this.yearSelectorButton.element);
		pageHeader.appendChild(forwardButton.element);
	}

	openDateSelectorPage(): void {
		this.initDateSelectorPage();
		this.goTo(0);
	}
	
	openMonthSelectorPage(): void {
		this.initMonthSelectorPage();
		this.goTo(1);
	}

	openYearSelectorPage(): void {
		this.initYearSelectorPage();
		this.goTo(2);
	}

}