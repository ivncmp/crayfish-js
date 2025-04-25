import { getEnvironment } from "./environment";
import { CrayfishLogger } from "./logger";
import { BaseAuthentication } from "./base/base-authentication";
import { JwtAuthentication } from "./authentication/jwt-authentication";
import { CognitoAuthentication } from "./authentication/cognito-authentication";
import { ControllerRequest, ControllerResponse } from "./types";
import { BaseController } from "./base/base-controller";
import { User } from "./model/user-model";

/**
 * Framework Authentication
 */
export class Authentication {

    private authenticationActive?: BaseAuthentication;

    constructor() {

        const authConfig = getEnvironment().authConfig;

        // COGNITO

        if (authConfig.provider === 'COGNITO' && authConfig.cognito) {
            CrayfishLogger.info(this, 'Cognito authentication initialized.');
            this.authenticationActive = new CognitoAuthentication();
        }

        // CUSTOM

        else if (authConfig.provider === 'JWT') {
            CrayfishLogger.info(this, 'Custom authentication initialized.');
            this.authenticationActive = new JwtAuthentication();
        }

        // NONE

        else {
            CrayfishLogger.warn(this, 'No authentication methods configured.');
        }
    }

    /**
     * login
     */
    public async login(request: ControllerRequest) {

        if (!this.authenticationActive) {
            return BaseController.response(request, 500, { error: "CONFIGURATION_INVALID" });
        }

        await this.authenticationActive.login(request);
    }

    /**
     * login
     */
    public async authenticateToken(request: ControllerRequest): Promise<User | null> {

        if (!this.authenticationActive) {
            return BaseController.response(request, 500, { error: "CONFIGURATION_INVALID" });
        }

        return await this.authenticationActive.authenticateToken(request);
    }
};