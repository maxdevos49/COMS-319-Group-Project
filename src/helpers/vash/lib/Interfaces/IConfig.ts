
/**
 *Interface for all config properties that must be present or optional ones
 */
export interface IConfig {
	/**
	 * Project Title
	 */
	title: string;

	/**
	 * Version release date
	 */
	versionRelease: string;

	/**
	 * Version Title(Alpha, Beta,...)
	 */
	versionTitle: string;

	/**
	 * Version number
	 */
	version: string;

	/**
	 * Project Description
	 */
	description: string;

	/**
	 * The owners of the project
	 */
	owner: string[];

	/**
	 * Developersinfo
	 */
	developers: any[];

	/**
	 *Properties relevant to the server
	 */
	server: {

		enviroment: string;

		port: string;

		domain: string;

		transport: string;
	};

	/**
	 * Configuration for hashing
	 */
	hash: {
		salt: string;
	};

	/**
	 * Configuration for the database
	 */
	database: {
		dbUrl: string;
	};

	/**
	 * Configuration for the session
	 */
	session: {
		secret: string;
	};

	/**
	 * Configuration for controllers
	 */
	controllers: any[];

}