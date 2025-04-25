import {
    Controller, Endpoint, Meta, MetaType, Method,
    BaseController, Inject, ControllerRequest,
    getEnvironment
} from "crayfish-js";

import { HealthService } from "../service/health-service";
import { ProjectEnvironment } from "../environment";

@Controller("/health")
export class HealthController extends BaseController {

    @Inject() healthService!: HealthService;

    @Meta(MetaType.DESCRIPTION, "Main Health Endpoint")
    @Endpoint(Method.GET, "/")
    async getHealth(request: ControllerRequest) {

        const environment = getEnvironment() as ProjectEnvironment;
        const health = this.healthService.getHealth(request);
        const user = await this.getAuthenticatedUser(request);

        // Return

        return {
            code: "OK",
            environment: environment.toString(),
            health: health,
            user: user
        };
    }
}