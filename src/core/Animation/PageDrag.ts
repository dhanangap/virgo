import Page from "../PagedComponent/Page";
import PageContainer from "../PagedComponent/PageContainer";

export default class PageDrag {

	parent: PageContainer;
	startPos: number;
	amount: number;
	isDragging: boolean;

	threshold: number;

	activePage?: Page;
	previousPage?: Page;
	nextPage?: Page;

	activePageStartPos?: number;
	previousPageStartPos?: number;
	nextPageStartPos?: number;

	containerStartHeight?: number;
	containerPreviousHeight?: number;
	containerNextHeight?: number;

	constructor(parent: PageContainer) {
		this.parent = parent;
		this.startPos = 0;
		this.amount = 0;
		this.threshold = 0.15;
		this.isDragging = false;

		// Cursor drag
		this.parent.element.addEventListener("mousedown", (event) => {
			this.initDrag(event.pageX)
		});
		this.parent.element.addEventListener("mousemove", (event) => {
			this.drag(event.pageX);
		});
		this.parent.element.addEventListener("mouseup", () => {
			this.stopDrag();
		});
		this.parent.element.addEventListener("mouseleave", () => {
			this.stopDrag();
		});

		// Touch drag
		this.parent.element.addEventListener("touchstart", (event) => {
			this.initDrag(event.touches[0].clientX);
		});
		this.parent.element.addEventListener("touchmove", (event) => {
			this.drag(event.touches[0].clientX);
		});
		this.parent.element.addEventListener("touchend", () => {
			this.stopDrag();
		});
	}

	initDrag(startPos: number): void {
		this.isDragging = true;
		this.parent.parent.element.classList.add("dragging");
		this.startPos = startPos;

		this.activePage = this.parent.activePage;
		this.previousPage = this.parent.previousPage;
		this.nextPage = this.parent.nextPage;

		const containerRect = this.parent.element.getBoundingClientRect();
		const activePageRect = this.activePage.element.getBoundingClientRect();
		const previousPageRect = this.previousPage.element.getBoundingClientRect();
		const nextPageRect = this.nextPage.element.getBoundingClientRect();

		this.activePageStartPos = activePageRect.left - containerRect.left;
		this.previousPageStartPos = this.activePageStartPos - previousPageRect.width;
		this.nextPageStartPos = this.activePageStartPos + activePageRect.width;

		this.containerStartHeight = containerRect.height;
		this.containerPreviousHeight = this.previousPage.element.getBoundingClientRect().height;
		this.containerNextHeight = this.nextPage.element.getBoundingClientRect().height;

		this.parent.element.style.userSelect = "none";
		this.parent.parent.stopAutoplay();
	}

	drag(amount: number): void {
		if (this.isDragging) {
			this.amount = amount - this.startPos;

			const movingRatio = this.amount / this.activePage.element.getBoundingClientRect().width;
			let containerHeight = 0;

			if (movingRatio < 0) {
				if (this.containerNextHeight > this.containerStartHeight) containerHeight = this.containerStartHeight + Math.abs((this.containerNextHeight - this.containerStartHeight) * movingRatio);
				else containerHeight = this.containerStartHeight - Math.abs((this.containerStartHeight - this.containerNextHeight) * movingRatio);
			} else {
				if (this.containerPreviousHeight > this.containerStartHeight) containerHeight = this.containerStartHeight + Math.abs((this.containerPreviousHeight - this.containerStartHeight) * movingRatio);
				else containerHeight = this.containerStartHeight - Math.abs((this.containerStartHeight - this.containerPreviousHeight) * movingRatio);
			}
			this.parent.element.style.height = `${containerHeight}px`;
			this.activePage.element.style.transform = `translateX(${this.activePageStartPos + this.amount}px)`;
			this.previousPage.element.style.transform = `translateX(${this.previousPageStartPos + this.amount}px)`;
			this.nextPage.element.style.transform = `translateX(${this.nextPageStartPos + this.amount}px)`;
		}
	}

	stopDrag(): void {

		if (this.isDragging) {

			this.parent.parent.element.classList.remove("dragging");

			const elementWidth = this.activePage.element.getBoundingClientRect().width;
			let direction = 0;
			if (this.amount >= (elementWidth * this.threshold)) direction = -1;
			else if (this.amount <= (elementWidth * this.threshold * -1)) direction = 1;

			this.isDragging = false;
			this.amount = 0;
			this.startPos = 0;

			const duration = 300;
			const animationConfig: KeyframeEffectOptions = {
				duration: duration,
				easing: "ease-out",
			};

			// Revert to normal
			if (direction === 0) {
				setTimeout(() => {
					this.parent.element.style.height = `${this.containerStartHeight}px`;
					this.activePage.element.style.transform = `translateX(${this.activePageStartPos}px)`;
					this.previousPage.element.style.transform = `translateX(${this.previousPageStartPos}px)`;
					this.nextPage.element.style.transform = `translateX(${this.nextPageStartPos}px)`;
				}, duration - 10);
				setTimeout(() => {
					this.parent.element.style.height = ``;
					this.activePage.element.style.transform = ``;
					this.previousPage.element.style.transform = ``;
					this.nextPage.element.style.transform = ``;
				}, duration + 10);

				this.parent.element.animate([
					{ height: this.parent.element.style.height },
					{ height: `${this.containerStartHeight}px` },
				], animationConfig);

				this.activePage.element.animate([
					{ transform: this.activePage.element.style.transform },
					{ transform: `translateX(${this.activePageStartPos}px)` },
				], animationConfig);

				this.previousPage.element.animate([
					{ transform: this.previousPage.element.style.transform },
					{ transform: `translateX(${this.previousPageStartPos}px)` },
				], animationConfig);

				this.nextPage.element.animate([
					{ transform: this.nextPage.element.style.transform },
					{ transform: `translateX(${this.nextPageStartPos}px)` },
				], animationConfig);
			}

			// Go forward
			else if (direction === 1) {
				setTimeout(() => {
					this.parent.element.style.height = `${this.containerNextHeight}px`;
					this.activePage.element.style.transform = `translateX(${this.activePageStartPos - elementWidth}px)`;
					this.previousPage.element.style.transform = `translateX(${this.previousPageStartPos - elementWidth}px)`;
					this.nextPage.element.style.transform = `translateX(${this.nextPageStartPos - elementWidth}px)`;
				}, duration - 10);
				setTimeout(() => {
					this.parent.activePageIndex = this.parent.nextPageIndex;
					this.parent.element.style.height = ``;
					this.activePage.element.style.transform = ``;
					this.previousPage.element.style.transform = ``;
					this.nextPage.element.style.transform = ``;
				}, duration + 10);

				this.parent.element.animate([
					{ height: this.activePage.element.style.height },
					{ height: `${this.containerNextHeight}px` },
				], animationConfig);

				this.activePage.element.animate([
					{ transform: this.activePage.element.style.transform },
					{ transform: `translateX(${this.activePageStartPos - elementWidth}px)` },
				], animationConfig);

				this.previousPage.element.animate([
					{ transform: this.previousPage.element.style.transform },
					{ transform: `translateX(${this.previousPageStartPos - elementWidth}px)` },
				], animationConfig);

				this.nextPage.element.animate([
					{ transform: this.nextPage.element.style.transform },
					{ transform: `translateX(${this.nextPageStartPos - elementWidth}px)` },
				], animationConfig);
			}

			// Go back
			else if (direction === -1) {
				const elementWidth = this.activePage.element.getBoundingClientRect().width;
				setTimeout(() => {
					this.parent.element.style.height = `${this.containerPreviousHeight}px`;
					this.activePage.element.style.transform = `translateX(${this.activePageStartPos + elementWidth}px)`;
					this.previousPage.element.style.transform = `translateX(${this.previousPageStartPos + elementWidth}px)`;
					this.nextPage.element.style.transform = `translateX(${this.nextPageStartPos + elementWidth}px)`;
				}, duration - 10);
				setTimeout(() => {
					this.parent.activePageIndex = this.parent.previousPageIndex;
					this.parent.element.style.height = ``;
					this.activePage.element.style.transform = ``;
					this.previousPage.element.style.transform = ``;
					this.nextPage.element.style.transform = ``;
				}, duration + 10);

				this.parent.element.animate([
					{ height: this.activePage.element.style.height },
					{ height: `${this.containerPreviousHeight}px` },
				], animationConfig);

				this.activePage.element.animate([
					{ transform: this.activePage.element.style.transform },
					{ transform: `translateX(${this.activePageStartPos + elementWidth}px)` },
				], animationConfig);

				this.previousPage.element.animate([
					{ transform: this.previousPage.element.style.transform },
					{ transform: `translateX(${this.previousPageStartPos + elementWidth}px)` },
				], animationConfig);

				this.nextPage.element.animate([
					{ transform: this.nextPage.element.style.transform },
					{ transform: `translateX(${this.nextPageStartPos + elementWidth}px)` },
				], animationConfig);
			}

			this.parent.element.style.userSelect = "";
			this.parent.parent.startAutoplay();
		}

	}

}