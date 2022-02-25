export interface PagedComponentConfig {
	
	transition?: string;
	transitionDuration?: number;
	autoplay?: boolean;
	autoplayDuration?: number;

	pageContainerSelector?: string;
	pageSelector?: string;
	controlSelector?: string;

	draggable?: boolean;
}

export const PagedComponentConfigDefaults: PagedComponentConfig = {

	transition: "slide",
	transitionDuration: 500,
	autoplay: false,
	autoplayDuration: 3000,

	pageContainerSelector: ".pages",
	pageSelector: ".page",
	controlSelector: ".control",

	draggable: true,

};