import Option from "./Option";
import FormControlConfig from "../FormControlConfig";

export default interface SelectInputConfig extends FormControlConfig {
	options?: Array<Option>;
	placeholder?: string;
}