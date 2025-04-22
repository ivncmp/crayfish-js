import { 
    Service, BaseService, ControllerRequest
} from "crayfish-js";

@Service()
export class HealthService extends BaseService {

    /**
     * getHealth
     */
    async getHealth(request: ControllerRequest) {

        return { request }
    }
}