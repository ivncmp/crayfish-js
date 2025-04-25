import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { BaseAuthentication } from "../base/base-authentication";
import { BaseController } from "../base/base-controller";
import { getEnvironment } from "../environment";

import { ControllerRequest } from "../types";
import { User } from "../model/user-model";

/**
 * CognitoAuthentication
 */
export class CognitoAuthentication implements BaseAuthentication {

    /**
     * login
     */
    async login(request: ControllerRequest): Promise<{ user: User, token: string }> {

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
    async authenticateToken(request: ControllerRequest): Promise<User | null> {

        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }
};