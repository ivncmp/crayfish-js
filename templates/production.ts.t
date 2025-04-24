import { ProjectEnvironment } from "../environment";

/**
 * Production Environment
 * 
 * This is the example production environment.
 */

const production = new ProjectEnvironment("production", "PRODUCTION");
production.parameterOne = "This is";
production.parameterTwo = "production";

export default production;