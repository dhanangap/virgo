import Component from "../Component/Component";
import Page from "./Page";
import PagedComponent from "./PagedComponent";

/**
 * Class representing container of Pages inside a PagedComponent.
 */
export default class PageContainer extends Component {

	static className = "pages";

	parent: PagedComponent;
	pages: Array<Page>;

	/** Returns index of currently active Page. */
	get activePageIndex(): number		{ return this.parent.activePageIndex; }

	/** Set the index of active Page. */
	set activePageIndex(index: number) 	{ this.parent.activePageIndex = index; }
	
	/** Returns index of the first Page. */
	get firstPageIndex(): number 		{ return 0; }
	
	/** Returns index of the last Page. */
	get lastPageIndex(): number 		{ return this.pages.length - 1; }
	
	/** Returns index of the next Page of currently active Page. */
	get nextPageIndex(): number 		{ return (this.activePageIndex === this.lastPageIndex) ? (0) : (this.activePageIndex + 1); }
	
	/** Returns index of the previous Page of currently active Page. */
	get previousPageIndex(): number 	{ return (this.activePageIndex === this.firstPageIndex) ? (this.lastPageIndex) : (this.activePageIndex - 1); }
	
	/** Returns currently active Page. */
	get activePage(): Page 				{ return this.pages.find(page => page.isActive); }

	/** Returns the next of currently active Page. */
	get nextPage(): Page 				{ return this.pages.find(page => page.isNext); }
	
	/** Returns the previous of currently active Page. */
	get previousPage(): Page 			{ return this.pages.find(page => page.isPrevious); }

	/** Returns the first Page. */
	get firstPage(): Page 				{ return this.pages[this.firstPageIndex]; }

	/** Returns the last Page. */
	get lastPage(): Page 				{ return this.pages[this.lastPageIndex]; }

	/**
	 * Creates a new instance of this class.
	 * @param parent - PagedComponent instance that contains this.
	 * @param element - HTML DOM Element of this instance.
	 */
	constructor(parent: PagedComponent, element: HTMLElement) {
		super(element);

		this.parent = parent;
		this.pages = [];
		this.initPages();
	}

	/**
	 * Initialize Pages contained by this instance.
	 */
	initPages(): void {
		const pageElements = this.element.querySelectorAll(this.parent._config.pageSelector);
		for (let index = 0; index < pageElements.length; index++) {
			const pageElement = pageElements[index] as HTMLElement;
			this.pages.push(new Page(this, index, pageElement));
		}
		if (pageElements.length === 0) {
			let pageElement = document.createElement("div");
			pageElement.setAttribute("class", "page");
			this.element.appendChild(pageElement);
			this.pages.push(new Page(this, 0, pageElement));
		}
	}

	/**
	 * Update all Pages to reflect real-time conditions.
	 */
	updatePages(): void {
		for (const page of this.pages) {
			page.update();
		}
	}

	/**
	 * Add a new Page.
	 * @param index - Index for the new Page.
	 * @param element - HTML DOM Element of the new Page.
	 */
	addPage(index: number, element: HTMLElement | Element): void {
		let refPage: HTMLElement;
		let newPage: Page = new Page(this, index, element as HTMLElement);

		if (this.pages[index]) {
			refPage = this.pages[index].element;
			refPage.before(newPage.element);
			if (index <= this.activePageIndex) this.activePageIndex = this.activePageIndex + 1;
		}
		else if (this.pages.length === 0) {
			this.element.appendChild(newPage.element);
			this.activePageIndex = 0;
		}
		else if (index === this.pages.length) {
			refPage = this.pages[index - 1].element;
			refPage.after(newPage.element);
			if (index <= this.activePageIndex) this.activePageIndex = this.activePageIndex + 1;
		}
		else {
			return;
		}

		this.pages.splice(index, 0, newPage);

		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i];
			page.index = i;
		}
		this.updatePages();
	}

	/**
	 * Remove all Pages inside this instance.
	 */
	removeAllPages(): void {
		this.pages = [];
		this.element.innerHTML = "";
	}

	/**
	 * Remove specific Page inside this instance.
	 * @param index - Index of the Page to be removed.
	 */
	removePage(index: number): void {
		if (this.pages[index]) {
			this.pages[index].element.remove();
			this.pages.splice(index, 1);
			this.updatePages();
		}
	}

}