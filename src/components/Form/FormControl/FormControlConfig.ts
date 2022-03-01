import { ComponentConfig, ComponentConfigDefaults } from "../../../core/Component/ComponentConfig";

/**
 * Virgo Library
 * ComponentConfig Interface
 * Author: Dhanang (https://github.com/dhanangap)
 */
export default interface FormControlConfig extends ComponentConfig {

	type?: string;
	name?: string;
	value?: string | number | boolean | null;
	isRequired?: boolean;
	placeholder?: string;

}

/**
 * ComponentConfig default values
 */
export const FormControlConfigDefaults: FormControlConfig = {

	...ComponentConfigDefaults,

	isRequired: false,

};