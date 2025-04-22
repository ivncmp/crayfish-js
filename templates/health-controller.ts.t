import {
    Controller, Endpoint, Meta, MetaType, Method, 
    BaseController, Inject, ControllerRequest, 
    Environment
} from "crayfish-js";

import { HealthService } from "../service/health-service";

@Controller("/health")
export class HealthController extends BaseController {

    @Inject() healthService!: HealthService;

    @Meta(MetaType.DESCRIPTION, "Main Health Endpoint")
    @Endpoint(Method.GET, "/")
    async getHealth(request: ControllerRequest, environment: Environment) {

        const health = await this.healthService.getHealth(request);

        // Return

        return {
            code: "OK",
            health: health,
            environment: environment
        };
    }
}