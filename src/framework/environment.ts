/**
 * Framework Environment
 */

export type EnvironmentType = "PRODUCTION" | "STAGING" | "LOCAL";

export type AuthenticationConfiguration = {
    provider: 'COGNITO' | 'JWT';
    methods: ('USERNAME_AND_PASSWORD' | 'FEDERATED' | 'API-KEY')[];
    jwt?: {
        secret: string
    },
    cognito?: {
        userPoolId: string;
        clientId: string;
        region: string;
        credentials: {
            accessKeyId: string;
            secretAccessKey: string;
        },
    }
};

export class Environment {

    projectName: string = "Project Name";
    projectDescription: string = "This is the sample project description.";
    projectVersion: string = "1.0.0";

    name: string;
    type: EnvironmentType;

    authConfig: AuthenticationConfiguration = {
        provider: 'JWT',
        methods: ["USERNAME_AND_PASSWORD"],
        jwt: {
            secret: "thisIsSecret"
        }
    };

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