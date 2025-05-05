import { ProjectEnvironment } from "../environment";

/**
 * Production Environment
 * 
 * This is the example production environment.
 */

const production = new ProjectEnvironment("production", "PRODUCTION");

production.projectName = "My Project";
production.projectDescription = "My Project Description";
production.projectVersion = "1.0.0";

production.parameterOne = "This is";
production.parameterTwo = "production";

export default production;