import { BaseAuthentication } from "../base/base-authentication";
import { getEnvironment } from "../environment";
import { BaseUser, BaseUserModel } from "../base/base-user-model";
import { ControllerRequest } from "../types";

/**
 * CognitoAuthentication
 */
export class CognitoAuthentication implements BaseAuthentication {

    // User Model Implementation

    userModel: BaseUserModel;

    constructor(userModel: BaseUserModel) {

        this.userModel = userModel;
    }

    /**
     * register
     */
    register(request: ControllerRequest): Promise<BaseUser> {

        const authConfig = getEnvironment().authConfig;

        if (!authConfig || authConfig.provider !== "COGNITO" || !authConfig.cognito) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }

    /**
     * login
     */
    async login(request: ControllerRequest): Promise<{ user: BaseUser, token: string }> {

        const authConfig = getEnvironment().authConfig;

        if (!authConfig || authConfig.provider !== "COGNITO" || !authConfig.cognito) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }

    /**
     * authenticateToken
     */
    async authenticateToken(request: ControllerRequest): Promise<BaseUser | undefined> {

        const authConfig = getEnvironment().authConfig;

        if (!authConfig || authConfig.provider !== "COGNITO" || !authConfig.cognito) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }
};