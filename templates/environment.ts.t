import { Environment, EnvironmentType } from "crayfish-js";

/**
 * ProjectEnvironment
 * 
 * This class represents the custom implementation of the environment. 
 * Add the necessary parameters here to complete the environment object.
 */
export class ProjectEnvironment extends Environment {

    parameterOne?: string;
    parameterTwo?: string;

    constructor(_name: string, _type: EnvironmentType) {

        super(_name, _type);
    }

    toString() {

        return this.parameterOne + " " + this.parameterTwo;
    }
}