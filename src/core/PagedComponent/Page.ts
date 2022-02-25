import Component from "../Component/Component";
import PageContainer from "./PageContainer";

/**
 * Class representing Page inside PagedComponent.
 */
export default class Page extends Component {

	index: number;
	parent: PageContainer;

	/** Returns a boolean indicating whether this is an active page. */
	get isActive(): boolean		{ return this.index === this.parent.activePageIndex; }
	/** Returns a boolean indicating whether this is first page. */
	get isFirst(): boolean 		{ return this.index === this.parent.firstPageIndex; }
	/** Returns a boolean indicating whether this is last page. */
	get isLast(): boolean 		{ return this.index === this.parent.lastPageIndex; }
	/** Returns a boolean indicating whether this is the previous of an active page. */
	get isPrevious(): boolean	{ return this.index === this.parent.previousPageIndex; }
	/** Returns a boolean indicating whether this is the next of an active page. */
	get isNext(): boolean 		{ return this.index === this.parent.nextPageIndex; }

	/**
	 * Creates a Page instance.
	 * @param parent - PageContainer that contains this instance.
	 * @param index - Index number of this instance between other pages inside the parent.
	 * @param element - HTML DOM Element of this instance.
	 */
	constructor(parent: PageContainer, index: number, element: HTMLElement) {
		super(element);
		this.parent	= parent;
		this.index	= index;
	}

	/** Updates the page classes to reflect real-time conditions.  */
	update(): void {
		// Remove classes.
		this.element.classList.remove("active");
		this.element.classList.remove("previous");
		this.element.classList.remove("next");
		// Give the class accordingly.
		if (this.isActive)			this.element.classList.add("active");
		else if (this.isPrevious) 	this.element.classList.add("previous");
		else if (this.isNext) 		this.element.classList.add("next");
	}

}