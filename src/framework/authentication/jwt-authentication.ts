import { BaseAuthentication } from "../base/base-authentication";
import { getEnvironment } from "../environment";
import { CrayfishLogger } from "../logger";

import { ControllerRequest } from "../types";
import { BaseUser, BaseUserModel } from "../base/base-user-model";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * JwtAuthentication
 */
export class JwtAuthentication implements BaseAuthentication {

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

        if (!authConfig || authConfig.provider !== "JWT" || !authConfig.jwt) {
            throw Error(JSON.stringify({ code: 500, error: "CONFIGURATION_INVALID" }));
        }

        const { username, password } = request.body;

        if (!username || !password) {
            throw Error(JSON.stringify({ code: 400, error: "INVALID_PARAMETERS" }));
        }

        const user = await this.userModel.findOne({ username });

        if (!user) {
            throw Error(JSON.stringify({ code: 404, error: "NOT_FOUND" }));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        console.log(hashPassword);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw Error(JSON.stringify({ code: 401, error: "NOT_AUTHORIZED" }));
        }

        try {

            const token = jwt.sign({ key: user.key },
                authConfig.jwt?.secret, { expiresIn: '1h' });

            return { user, token }

        } catch (error) {

            CrayfishLogger.error(this, error);
            throw Error(JSON.stringify({ code: 500, error: "JWT_ERROR" }));
        }
    }

    /**
     * authenticateToken
     */
    async authenticateToken(request: ControllerRequest): Promise<BaseUser | null> {

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

            const user = jwt.verify(token, authConfig.jwt.secret) as BaseUser;

            if (!user) {
                throw Error(JSON.stringify({ code: 401, error: "INVALID_TOKEN" }));
            }

            return await this.userModel.findOne({ key: user.key });

        } catch (error) {

            CrayfishLogger.error(this, error);
            throw Error(JSON.stringify({ code: 500, error: "JWT_ERROR" }));
        }
    }
};