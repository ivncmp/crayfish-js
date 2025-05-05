/**
 * Framework User
 */

import { BaseModel, ModelData } from "./base-model";

export interface BaseUser {
    key: string;
    password: string;
    email?: string;
    username?: string;
};

export abstract class BaseUserModel extends BaseModel {

    protected isUserModel() { return true; }

    save(baseUser: BaseUser): Promise<BaseUser> {
        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }

    findOne(modelData: ModelData): Promise<BaseUser | undefined> {
        throw Error(JSON.stringify({ code: 500, error: "NOT_IMPLEMENTED" }));
    }
};