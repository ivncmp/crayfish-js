/**
 * Framework Environment
 */

export type EnvironmentType = "PRODUCTION" | "STAGING" | "LOCAL";

export class Environment {

    name: string;
    type: EnvironmentType;

    constructor(_name: string, _type: EnvironmentType) {

        this.name = _name;
        this.type = _type;
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