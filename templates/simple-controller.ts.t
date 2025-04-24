import {
    Controller, Endpoint, Meta, MetaType, Method, 
    BaseController, ControllerRequest
} from "crayfish-js";

@Controller("/${controllerName}")
export class ${controllerClass} extends BaseController {

    @Meta(MetaType.DESCRIPTION, "Simple GET for /${controllerName}")
    @Endpoint(Method.GET, "/")
    async ${controllerMethod}(request: ControllerRequest) {

        // Return

        return {
            code: "OK"
        };
    }
}