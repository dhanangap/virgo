import { ComponentConfig, ComponentConfigDefaults } from "../../core/Component/ComponentConfig";

/**
 * Virgo Library
 * ComponentConfig Interface
 * Author: Dhanang (https://github.com/dhanangap)
 */
export default interface ButtonConfig extends ComponentConfig {

	label?: string;
	variant?: string;
	color?: string;
	leftIcon?: string;
	rightIcon?: string;
	icon?: string;

}

/**
 * ComponentConfig default values
 */
export const ButtonConfigDefaults: ButtonConfig = {

	...ComponentConfigDefaults,

};