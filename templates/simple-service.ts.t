import { 
    Service, BaseService, CrayfishLogger
} from "crayfish-js";

@Service()
export class ${serviceClass} extends BaseService {

    /**
     * helloWorld
     */
    helloWorld() {

        CrayfishLogger.info(this, "Hello World!");
    }
}