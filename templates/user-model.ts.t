import {
    Model, BaseUserModel, BaseUser, ModelData
} from "crayfish-js";

import { randomUUID } from 'crypto';

/**
 * User Model
 */

export class User implements BaseUser {

    key!: string;
    email!: string;
    username!: string;
    password!: string;

    constructor() {

        this.key = randomUUID();
        this.password = "";
    }
}

@Model()
export class UserModel extends BaseUserModel {

    users: User[] = [];

    unmarshall(modelData: ModelData) {

        const user = new User();
        user.email = modelData.email;
        user.username = modelData.username;

        return user;
    }

    marshall(user: User) {

        const cloned = JSON.parse(JSON.stringify(user));
        delete cloned.password;

        return cloned;
    }

    async save(modelData: User): Promise<BaseUser> {

        this.users.push(modelData);

        return modelData;
    }

    async findOne(filter: any): Promise<User | undefined> {

        if (filter.email) {
            return this.users.find(u => u.email == filter.email);
        }

        if (filter.username) {
            return this.users.find(u => u.username == filter.username);
        }

        return undefined;
    }
};