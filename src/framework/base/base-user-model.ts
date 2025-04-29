/**
 * Framework User
 */

import { BaseModel } from "./base-model";

export interface BaseUser {
    key: string,
    email: string,
    username: string,
    password: string
};

export class BaseUserModel extends BaseModel {

    protected isUserModel() { return true; }

    findOne(filter: any): Promise<BaseUser> {
        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }
};