import {
    Service, BaseService, ControllerRequest
} from "crayfish-js";

@Service()
export class HealthService extends BaseService {

    /**
     * getHealth
     */
    getHealth(request: ControllerRequest): string {

        return "This is a " + request.httpMethod +
            " call to " + request.headers.host;
    }
}