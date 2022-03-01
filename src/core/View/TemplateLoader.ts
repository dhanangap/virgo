import { renderString } from "nunjucks";

export default class TemplateLoader {

	static renderString (htmlString: string, data?: any) : string {
		return renderString(htmlString, data ? data : {});
	}

	static renderDOM (htmlString: string, data?: any) : HTMLElement {
		let element = document.createElement("div");
		element.innerHTML = this.renderString(htmlString, data ? data : {});
		return element;
	}

}