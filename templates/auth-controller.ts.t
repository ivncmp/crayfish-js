import {
    Controller, Endpoint, Meta, MetaType, Method,
    BaseController, ControllerRequest
} from "crayfish-js";

@Controller("/auth")
export class AuthController extends BaseController {

    @Meta(MetaType.DESCRIPTION, "Main Health Endpoint")
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