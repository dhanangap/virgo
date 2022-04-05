import { ComponentConfig, ComponentConfigDefaults } from "./ComponentConfig";

/** Virgo Component base class. */
export default class Component {

	// [ Static ] ---------------------------------------------------------------------------------

	static className: string 			= "component";
	static defaultSelector?: string 	= ".component";
	static registry: any 				= {};
	static config: ComponentConfig 		= ComponentConfigDefaults;

	/**
	 * Returns array of instances of this class.
	 * Will return an empty array if there's no instance registered.
	 */
	static get instances(): Array<Component> {
		if (!this.registry[this.className]) return [];
		return this.registry[this.className];
	}

	/**
	 * Register created instance of this class to be indexed and used later.
	 * @param instance - The instance to be registered
	 */
	static register(instance: Component) {
		if (!this.registry[this.className]) this.registry[this.className] = [];
		this.registry[this.className].push(instance);
	}

	/**
	 * Initialize class and creating instances from selector.
	 * @param selector - A valid query selector of elements to be created as instance of this class (optional).
	 * @param config - Component configuration (optional).
	 * @returns total number of instances created.
	 */
	static init(selector?: string, config: ComponentConfig = ComponentConfigDefaults): number {
		
		// If autoCreateInstances config is true, create instances from selected elements on the page.
		if (this.config.autoCreateInstances) {
			const elements = document.querySelectorAll(selector ? selector : this.defaultSelector);
			for (let index = 0; index < elements.length; index++) {
				const element = elements[index] as HTMLElement;
				let id: string;
				// Generate the id.
				if (config.autoGenerateId) id = element.id ? element.id : `${this.className}-${this.instances.length}`;
				// Register the newly created instance.
				this.register(new this(element, { ...config, id }));
			}
			return elements.length;
		}
		// Return 0 if autoCreateInstances config is set to false.
		return 0;
	}

	// [ Instance ] -------------------------------------------------------------------------------

	id?: string;			// Unique identifier of the instance.
	element: HTMLElement;	// DOM Element of the instance.

	/**
	 * Create instance of this class.
	 * @param element - HTML Element (or query selector string of element) to be created as instance.
	 * @param config - Component configuration of the instance.
	 */
	constructor(element: HTMLElement | Element | string, config: ComponentConfig = ComponentConfigDefaults) {
		let htmlElement: HTMLElement = (typeof element === "string") ? document.querySelector(element) as HTMLElement : element as HTMLElement;
		if (!htmlElement) return;
		// Set properties of this instance.
		this.element 	= htmlElement;
		this.id 		= config.id ? config.id : undefined;
		// If an id is provided, set element's HTML id.
		if (this.id) this.element.id = this.id;
	}

}