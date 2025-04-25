import { ProjectEnvironment } from "../environment";

/**
 * Staging Environment
 * 
 * This is the example staging environment.
 */

const staging = new ProjectEnvironment("staging", "STAGING");

staging.projectName = "My Project";
staging.projectDescription = "My Project Description";
staging.projectVersion = "1.0.0";

staging.parameterOne = "This is";
staging.parameterTwo = "staging";

export default staging;