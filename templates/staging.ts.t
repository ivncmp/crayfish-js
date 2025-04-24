import { ProjectEnvironment } from "../environment";

/**
 * Staging Environment
 * 
 * This is the example staging environment.
 */

const staging = new ProjectEnvironment("staging", "STAGING");
staging.parameterOne = "This is";
staging.parameterTwo = "staging";

export default staging;