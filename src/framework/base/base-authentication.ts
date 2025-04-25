import { User } from "../model/user-model";
import { ControllerRequest } from "../types";

/**
 * JwtAuthentication
 */
export interface BaseAuthentication {

    login(request: ControllerRequest): Promise<{ user: User, token: string }>;

    authenticateToken(request: ControllerRequest): Promise<User | null>;
};