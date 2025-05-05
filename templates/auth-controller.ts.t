import {
    Controller, Endpoint, Meta, MetaType, Method,
    BaseController, ControllerRequest
} from "crayfish-js";

@Controller("/auth")
export class AuthController extends BaseController {

    @Meta(MetaType.DESCRIPTION, "Register Endpoint")
    @Endpoint(Method.POST, "/register")
    async register(request: ControllerRequest) {

        // Perform the authentication

        const user = await super.getAuthenticationService()
            .register(request);

        // Return

        return {
            code: "OK",
            user: user
        };
    }

    @Meta(MetaType.DESCRIPTION, "Login Endpoint")
    @Endpoint(Method.POST, "/login")
    async login(request: ControllerRequest) {

        // Perform the authentication

        const authResult = await super.getAuthenticationService()
            .login(request);

        // Return

        return {
            code: "OK",
            user: authResult?.user,
            token: authResult?.token
        };
    }
}