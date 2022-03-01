import LocaleFormat from "./LocaleFormat";
import en_US from "./locales/en_US.json";

type localeArray = {
	[key: string]: LocaleFormat;
}

export default class Locale {

	static locales: localeArray = {
		en_US
	}

	static get(key: string): LocaleFormat {
		return this.locales[key];
	}

}