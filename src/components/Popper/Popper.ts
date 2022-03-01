import PopperConfig from "./PopperConfig";

export default class Popper {

	// Static properties

	static isInitialized: boolean = false;
	static containerElement: HTMLElement;
	static backdropElement: HTMLElement;
	static instances: Array<Popper> = [];

	// Static methods

	static init() {
		if (!this.isInitialized) {
			this.initContainer();
			window.addEventListener("resize", () => {
				for (const instance of this.instances) {
					instance.update();
				}
			});
			this.initEvents();
			this.isInitialized = true;
		}
	}

	static initContainer(): void {
		if (!this.containerElement) {
			this.containerElement = document.querySelector("body > .popper");
			if (!this.containerElement) {
				this.containerElement = document.createElement("div");
				this.containerElement.classList.add("popper");
				document.body.appendChild(this.containerElement);
			}
		}
	}

	static initEvents(): void {
		if (!this.isInitialized) {
			document.addEventListener("click", (event) => {
				this.instances.forEach(instance => {
					if (!(instance.element.contains(event.target as Node) || instance.ref.contains(event.target as Node))) {
						if (!instance.hidden) instance.hide();
					}
				});
			});
		}
	}

	// Object properties

	ref: HTMLElement;
	element: HTMLElement;
	position: string;
	config: PopperConfig;

	onShow?: Function;
	onHide?: Function;

	get top(): number {
		return parseFloat(this.element.style.top);
	}
	set top(value: number | string) {
		if (typeof value === "number") {
			this.element.style.top = `${value}px`;
		}
		else if (typeof value === "string") {
			this.element.style.top = value;
		}
	}
	get left(): number {
		return parseFloat(this.element.style.left);
	}
	set left(value: number | string) {
		if (typeof value === "number") {
			this.element.style.left = `${value}px`;
		}
		else if (typeof value === "string") {
			this.element.style.left = value;
		}
	}
	get width(): number {
		return parseFloat(this.element.style.width);
	}
	set width(value: number | string) {
		if (typeof value === "number") {
			this.element.style.width = `${value}px`;
		}
		else if (typeof value === "string") {
			this.element.style.width = value;
		}
	}
	get height(): number {
		return parseFloat(this.element.style.height);
	}
	set height(value: number | string) {
		if (typeof value === "number") {
			this.element.style.height = `${value}px`;
		}
		else if (typeof value === "string") {
			this.element.style.height = value;
		}
	}

	get hidden(): boolean {
		return this.element.style.display === "none";
	}
	set hidden(value: boolean) {
		if (value) {
			this.element.style.display = "none";
		} else {
			this.element.style.display = null;
		}
	}

	// Object methods

	constructor(ref: HTMLElement, element: HTMLElement, config: PopperConfig = {}) {
		Popper.init();
		
		this.ref 		= ref;
		this.element 	= element;
		this.element.style.position = "absolute";
		
		this.position	= config.position	? config.position	: "bottom";
		this.config		= config;
		
		if (this.config.width) {
			this.width = this.config.width;
		}

		this.update();
		this.hide();
		Popper.instances.push(this);
		Popper.containerElement.appendChild(this.element);
	}

	update(): void {
		const rect 		= this.ref.getBoundingClientRect();
		this.width 		=  this.config.width ? this.config.width : rect.width;
		this.height 	=  "auto";
		this.top 		=  rect.top + rect.height + 5 + window.scrollY;
		this.left 		=  rect.left + window.scrollX;
	}

	show(): void {
		this.hidden = false;
		if (this.onShow) this.onShow();
	}
	
	hide(): void {
		this.hidden = true;
		if (this.onHide) this.onHide();
	}

	toggle(): void {
		if (this.hidden) {
			this.show();
		} else {
			this.hide();
		}
	}

}