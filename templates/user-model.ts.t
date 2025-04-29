import {
    Model, BaseUserModel, BaseUser
} from "crayfish-js";

/**
 * User Model
 */

@Model()
export class UserModel extends BaseUserModel {

    async findOne(filter: any): Promise<BaseUser> {

        return {
            key: "12345678",
            email: "FakeMail@mail.com",
            username: "FakeUsername",
            password: "$2b$10$rQ0UqgWKU10Ct5umF1wyveXw6yL3Ie9fkXwd7OpTHaEEGaOS3bL9."
        };
    }
};