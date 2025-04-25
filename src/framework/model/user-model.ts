/**
 * Framework User
 */

export type User = {
    key: string,
    username: string,
    password: string
};

export class UserModel {

    static async findOne(filter: any): Promise<User> {

        return {
            key: "12345678",
            username: "FakeUsername",
            password: "password"
        };
    }
};