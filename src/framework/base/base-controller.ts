import { getModelRegistry, getRouteRegistry } from "../decorator";
import { BaseUser, BaseUserModel } from "../base/base-user-model";
import { AuthenticationService } from "../service/authentication-service";
import { ControllerHttpMethod, ControllerRequest, ControllerResponse } from "../types";
import { Utils } from "../utils";
import { generateSwagger, SwaggerEndpoint } from "../utils/swagger";

/**
 * Basic controller.
 */
export class BaseController {

    // Authentication Service bundled in the Controllers.

    private authenticationService: AuthenticationService;

    /**
     * BaseController constructor
     */
    constructor() {

        // Inject the dependencies

        Utils.injectDependencies(this);

        // Initialize the authentication.

        const baseUserModel = Object.values(getModelRegistry())
            .find((c: any) => c.isUserModel()) as BaseUserModel;

        if (baseUserModel) {
            this.authenticationService = new AuthenticationService(baseUserModel);
        } else {
            class MockUserModel extends BaseUserModel { }
            this.authenticationService = new AuthenticationService(new MockUserModel());
        }
    }

    /**
     * getAllowedHeaders
     */
    static getAllowedHeaders(): string {

        return "authorization, content-type, environment, referral, language";
    }

    /**
     * getAllowedOrigin
     */
    static getAllowedOrigin(request: ControllerRequest): string | null {

        if (request.headers && request.headers.origin) {
            return request.headers.origin;
        }

        return null;
    }

    /**
     * response
     */
    static response(request: ControllerRequest, status: number, body: any): ControllerResponse {

        // Build the CORS Headers.

        const allowedHeaders = BaseController.getAllowedHeaders();
        const allowedOrigin = BaseController.getAllowedOrigin(request);

        // Return the response

        const headers = allowedOrigin ? {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Headers": allowedHeaders,
            "Content-Type": "application/json"
        } : {
            "Content-Type": "application/json"
        };

        const response = {
            statusCode: status,
            body: JSON.stringify(body),
            headers: headers
        };

        // Return it

        return response;
    }

    /**
     * typedResponse
     */
    static typedResponse(request: ControllerRequest, type: string, status: number, body: any): ControllerResponse {

        // Build the CORS Headers.

        const allowedHeaders = BaseController.getAllowedHeaders();
        const allowedOrigin = BaseController.getAllowedOrigin(request);

        // Return the response

        const headers = allowedOrigin ? {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Headers": allowedHeaders,
            "Content-Type": "application/json"
        } : {
            "Content-Type": "application/json"
        };

        return {
            statusCode: status,
            body: body,
            headers: headers
        };
    }

    /**
     * parsePath
     */
    static parsePath(path: string): string[] {

        const urlBase = path.split("#")[0].split("?")[0];
        return urlBase.split("/").filter(p => p.length > 0);
    }

    /**
     * parsePath
     */
    static documentation(request: ControllerRequest) {

        // Extract the routes

        const routes: SwaggerEndpoint[] = [];

        for (const route of getRouteRegistry()) {

            // Find the base path

            const controller = route.controller;
            const controllerName = controller.constructor.name;
            const tag = controllerName + " Services";
            const description = route.description;
            const method = route.method.toUpperCase() as ControllerHttpMethod;
            const path = route.path;

            // Include it in the list.

            routes.push({ tag, method, path, description });
        }

        // Generate the Swagger

        const swagger = generateSwagger(routes);

        // Return it.

        return BaseController.response(request, 200, swagger);
    }

    /**
     * getAuthenticationService
     */
    getAuthenticationService(): AuthenticationService {

        return this.authenticationService
    }
}