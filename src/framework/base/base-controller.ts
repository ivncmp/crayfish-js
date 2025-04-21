import { Utils } from "../utils";

/**
 * Basic controller.
 */
export class BaseController {

    constructor() {

        Utils.injectDependencies(this);
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
    static getAllowedOrigin(request: GameRequest): string {

        return request.headers.origin;
    }

    /**
     * response
     */
    static response(request: GameRequest, status: number, body: any): ControllerResponse {

        // Build the CORS Headers.

        const allowedHeaders = BaseController.getAllowedHeaders();
        const allowedOrigin = BaseController.getAllowedOrigin(request);

        // Return the response

        const response = {
            statusCode: status,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Headers": allowedHeaders,
                "Content-Type": "application/json"
            }
        };

        // Return it

        return response;
    }

    /**
     * typedResponse
     */
    static typedResponse(request: GameRequest, type: string, status: number, body: any): ControllerResponse {

        // Build the CORS Headers.

        const allowedHeaders = BaseController.getAllowedHeaders();
        const allowedOrigin = BaseController.getAllowedOrigin(request);

        // Return the response

        return {
            statusCode: status,
            body: body,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Headers": allowedHeaders,
                "Content-Type": type
            }
        };
    }

    /**
     * parsePath
     */
    static parsePath(path: string): string[] {

        const urlBase = path.split("#")[0].split("?")[0];
        return urlBase.split("/").filter(p => p.length > 0);
    }
}