import { BaseAuthentication } from "../base/base-authentication";
import { getEnvironment } from "../environment";
import { CrayfishLogger } from "../logger";
import { User, UserModel } from "../model/user-model";

import { ControllerRequest } from "../types";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * JwtAuthentication
 */
export class JwtAuthentication implements BaseAuthentication {

    /**
     * login
     */
    async login(request: ControllerRequest): Promise<{ user: User, token: string }> {

        const authConfig = getEnvironment().authConfig;

        if (!authConfig || authConfig.provider !== "JWT" || !authConfig.jwt) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        const { username, password } = request.body;

        if (!username || !password) {
            throw Error(JSON.stringify({ code: 400, error: "INVALID_PARAMETERS" }));
        }

        try {

            const user = await UserModel.findOne({ username });

            if (!user) {
                throw Error(JSON.stringify({ code: 404, error: "NOT_FOUND" }));
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw Error(JSON.stringify({ code: 401, error: "NOT_AUTHORIZED" }));
            }

            const token = jwt.sign({ key: user.key }, authConfig.jwt?.secret, { expiresIn: '1h' });

            return { user, token }

        } catch (error) {

            CrayfishLogger.error(this, error);
            throw Error(JSON.stringify({ code: 500, error: "JWT_ERROR" }));
        }
    }

    /**
     * authenticateToken
     */
    async authenticateToken(request: ControllerRequest): Promise<User | null> {

        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return null;
        }

        const authConfig = getEnvironment().authConfig;

        if (!authConfig || authConfig.provider !== "JWT" || !authConfig.jwt) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        try {

            const user = jwt.verify(token, authConfig.jwt.secret) as User;

            if (!user) {
                throw Error(JSON.stringify({ code: 401, error: "INVALID_TOKEN" }));
            }

            return await UserModel.findOne({ key: user.key });

        } catch (error) {

            CrayfishLogger.error(this, error);
            throw Error(JSON.stringify({ code: 500, error: "JWT_ERROR" }));
        }
    }
};