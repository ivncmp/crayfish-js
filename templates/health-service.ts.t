import { 
    Service, BaseService 
} from "crayfish-js";

@Service()
export class HealthService extends BaseService {

    /**
     * getHealth
     */
    async getHealth(request: GameRequest) {

        return { request }
    }
}