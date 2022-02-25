import Page from "../PagedComponent/Page";
import PageContainer from "../PagedComponent/PageContainer";

export default class PageTransition {

	parent: PageContainer;
	fromIndex: number;
	targetIndex: number;
	direction: number;

	get fromPage(): Page {
		return this.parent.pages[this.fromIndex];
	}

	get targetPage(): Page {
		return this.parent.pages[this.targetIndex];
	}

	constructor(parent: PageContainer, fromIndex: number, targetIndex: number, direction: number) {
		this.parent = parent;
		this.fromIndex = fromIndex;
		this.targetIndex = targetIndex;
		this.direction = direction;
	}

	slide(duration: number, callback = function () { }) {
		setTimeout(() => {
			callback();
		}, duration - 10);

		const animationConfig: KeyframeAnimationOptions = {
			duration: duration,
			easing: "cubic-bezier(.46,.15,.31,.88)",
		};

		const parentHeightInitial = this.parent.element.getBoundingClientRect().height;
		const parentHeightAfter = this.targetPage.element.getBoundingClientRect().height;

		console.log(parentHeightInitial);
		console.log(parentHeightAfter);

		const fromPositionInitial = 0;
		const fromPositionAfter = fromPositionInitial - (this.targetPage.element.scrollWidth * this.direction);

		const targetPositionInitial = this.fromPage.element.scrollWidth * this.direction;
		const targetPositionAfter = 0;



		this.parent.element.animate([
			{ height: parentHeightInitial + "px" },
			{ height: parentHeightAfter + "px" },
		], animationConfig);

		this.fromPage.element.animate([
			{ transform: `translateX(${fromPositionInitial}px)` },
			{ transform: `translateX(${fromPositionAfter}px)` },
		], animationConfig);

		this.targetPage.element.animate([
			{ transform: `translateX(${targetPositionInitial}px)` },
			{ transform: `translateX(${targetPositionAfter}px)` },
		], animationConfig);
	}

	fade(duration: number, callback = function () { }) {

		const animationConfig: KeyframeAnimationOptions = {
			duration: duration,
			easing: "cubic-bezier(.2,.36,.07,.88)",
		};

		const parentHeightInitial = this.parent.element.getBoundingClientRect().height;
		const parentHeightAfter = this.targetPage.element.getBoundingClientRect().height;

		var parentAnimation = this.parent.element.animate([
			{ height: parentHeightInitial + "px" },
			{ height: parentHeightAfter + "px" },
		], animationConfig);

		parentAnimation.onfinish = (event) => {
			callback();
		}

		var currentPageAnimation = this.fromPage.element.animate([
			{ transform: `translate3d(0px, 0px, 0px)`, opacity: 1 },
			{ transform: `translate3d(0px, 0px, 0px)`, opacity: 0 },
		], {
			...animationConfig,
			duration: duration * 0.5,
		});

		currentPageAnimation.onfinish = (event) => {
			this.fromPage.element.animate([
				{ transform: `translate3d(0px, 0px, 0px)`, opacity: 0 },
				{ transform: `translate3d(0px, 0px, 0px)`, opacity: 0 },
			], {
				duration: duration * 0.5,
			});
			this.targetPage.element.animate([
				{ transform: `translate3d(0px, 0px, 0px)`, opacity: 0 },
				{ transform: `translate3d(0px, 0px, 0px)`, opacity: 1 },
			], {
				...animationConfig,
				duration: duration * 0.5,
			});
		}

	}

}