export default interface ScrollspyTarget {
	[key: string]: {
		element: HTMLElement,
		top: number,
		left: number,
		height: number,
		width: number,
	};
}