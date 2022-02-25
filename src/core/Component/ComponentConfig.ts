export interface ComponentConfig {

	// Static class usage
	autoCreateInstances?: boolean;
	autoGenerateId?: boolean;

	// Class instance config
	id?: string;

}

export const ComponentConfigDefaults: ComponentConfig = {

	// Static class usage
	autoCreateInstances: true,
	autoGenerateId: true,

	// Class instance config
	id: undefined,

};