import { CognitoAuthentication } from "../authentication/cognito-authentication";
import { JwtAuthentication } from "../authentication/jwt-authentication";
import { BaseAuthentication } from "../base/base-authentication";
import { BaseController } from "../base/base-controller";
import { getEnvironment } from "../environment";
import { CrayfishLogger } from "../logger";
import { BaseUser, BaseUserModel } from "../base/base-user-model";
import { ControllerRequest } from "../types";

/**
 * AuthenticationService
 */
export class AuthenticationService {

    private authenticationActive?: BaseAuthentication;

    constructor(userModel: BaseUserModel) {

        const authConfig = getEnvironment().authConfig;

        // COGNITO

        if (authConfig.provider === 'COGNITO' && authConfig.cognito) {
            CrayfishLogger.info(this, 'Cognito authentication initialized.');
            this.authenticationActive = new CognitoAuthentication(userModel);
        }

        // CUSTOM

        else if (authConfig.provider === 'JWT') {
            CrayfishLogger.info(this, 'Custom authentication initialized.');
            this.authenticationActive = new JwtAuthentication(userModel);
        }

        // NONE

        else {
            CrayfishLogger.warn(this, 'No authentication methods configured.');
        }
    }

    /**
     * login
     */
    public async login(request: ControllerRequest): Promise<{ user: BaseUser, token: string }> {

        if (!this.authenticationActive) {
            return BaseController.response(request, 500, { error: "CONFIGURATION_INVALID" });
        }

        return await this.authenticationActive.login(request);
    }

    /**
     * login
     */
    public async authenticateToken(request: ControllerRequest): Promise<BaseUser | null> {

        if (!this.authenticationActive) {
            return BaseController.response(request, 500, { error: "CONFIGURATION_INVALID" });
        }

        return await this.authenticationActive.authenticateToken(request);
    }
};