import { BaseUser } from "../base/base-user-model";
import { ControllerRequest } from "../types";

/**
 * BaseAuthentication
 */
export interface BaseAuthentication {

    register(request: ControllerRequest): Promise<BaseUser>;

    login(request: ControllerRequest): Promise<{ user: BaseUser, token: string }>;

    authenticateToken(request: ControllerRequest): Promise<BaseUser | undefined>;
};
