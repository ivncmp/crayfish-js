/**
 * Framework Environment
 */

export type EnvironmentType = "PRODUCTION" | "STAGING" | "LOCAL";

export class Environment {

    projectName: string = "Project Name";
    projectDescription: string = "This is the sample project description.";
    projectVersion: string = "1.0.0";

    name: string;
    type: EnvironmentType;

    constructor(_name: string, _type: EnvironmentType) {

        this.name = _name;
        this.type = _type;
    }

    static default() {

        return new Environment("not_found", "STAGING");
    }
};

// This is the exportable current environment.

let environment: Environment;

export function setEnvironment(_environment: Environment) {
    environment = _environment;
}

export function getEnvironment() {
    return environment;
}