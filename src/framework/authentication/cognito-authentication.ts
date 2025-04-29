import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
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
     * login
     */
    async login(request: ControllerRequest): Promise<{ user: BaseUser, token: string }> {

        const authConfig = getEnvironment().authConfig;

        if (!authConfig || authConfig.provider !== "COGNITO" || !authConfig.cognito) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        const cognitoClient = new CognitoIdentityProviderClient({
            region: authConfig.cognito.region,
            credentials: authConfig.cognito.credentials
        });

        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }

    /**
     * authenticateToken
     */
    async authenticateToken(request: ControllerRequest): Promise<BaseUser | null> {

        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }
};