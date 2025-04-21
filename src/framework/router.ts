// Route definition

import { BaseController } from "./base/base-controller";
import { getRouteRegistry, getServiceRegistry } from "./decorator";
import { GameLogger } from "./game-logger";
import { Utils } from "./utils";

/**
 * matchRouteScore
 */
function matchRouteScore(currentPathRaw: string, expectedPathRaw: string): number {

    let nVariables = 0;

    const currentPath: string[] = BaseController
        .parsePath(currentPathRaw);
    const expectedPath: string[] = BaseController
        .parsePath(expectedPathRaw);

    if (currentPath.length != expectedPath.length) {
        return 0;
    }

    for (let i = 0; i < currentPath.length; i++) {

        if (expectedPath[i].startsWith("{") && expectedPath[i].endsWith("}")) {
            nVariables++;
            continue;
        } else if (currentPath[i] !== expectedPath[i]) {
            return 0;
        }
    }

    return 1 + nVariables;
}

/**
 * buildRequest
 */
function buildRequest(event: ControllerEvent): GameRequest {

    // Request info.

    const local = event.local ? event.local : false;
    const domain = event.requestContext && event.requestContext.domainPrefix
        ? event.requestContext.domainPrefix : "localhost";
    const path = BaseController.parsePath(event.path);
    const rawBody = event.body;

    // Retrieve body data

    let body = {};

    try {
        body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
        body = event.body ? { data: event.body } : {};
    }

    // Process the rest of the parameters.

    const httpMethod = event.requestContext && event.requestContext.eventType ?
        "SOCKET_" + event.requestContext.eventType : event.httpMethod;
    const headers = event.headers;
    const queryParameters = event.queryStringParameters ? event.queryStringParameters : {};

    const clientIp = headers && headers['X-Forwarded-For'] ?
        headers['X-Forwarded-For'] : headers['x-forwarded-for'] ?
            headers['x-forwarded-for'] : "0.0.0.0";

    const getPathElement = (index: number) => {
        return path[index];
    };

    // Return it.

    return {
        local, path, rawBody, body, headers,
        httpMethod, queryParameters, domain,
        clientIp, getPathElement
    }
}

// Handle Requests

export async function handleRequest(data: GameRequest) {

    // Request Logic

    const requestStartTime = Date.now();

    // Options call

    if (data.httpMethod == "OPTIONS") {
        return BaseController.response(data, 200, {});
    }

    // Import Services.

    await Utils.importServices();

    // Import Controllers.

    await Utils.importControllers();

    // Inject Dependencies

    await Utils.injectDependencies();

    // Find the controller.

    const matchingRoutes = getRouteRegistry()
        .filter(r => r.method === data.httpMethod)
        .map(route => {
            const score = matchRouteScore(data.path, route.path);
            return { score, route };
        })
        .filter(bundle => bundle.score > 0);

    // Sort routes by score

    matchingRoutes.sort((a, b) => a.score - b.score);

    // Choose the best one.

    let currentRoute = matchingRoutes.length > 0
        ? matchingRoutes[0].route : null;

    // Not found

    if (!currentRoute || !currentRoute.controller) {
        return BaseController.response(data, 404,
            { error: "SERVICE_NOT_FOUND" });
    }

    // Logging 

    GameLogger.info(undefined, "[ Request ] "
        + new Date().toISOString() + " | " + data.httpMethod
        + " | " + data.path + " (" + currentRoute.description + ")");
    GameLogger.info(undefined, "[ Headers ] "
        + new Date().toISOString() + " | Query Parameters: "
        + JSON.stringify(data.queryStringParameters)
        + " | Header Parameters: " + JSON.stringify(data.headers));

    // Services Definition.

    // initializeServices();

    // Not found

    if (!currentRoute) {
        return BaseController.response(data, 404,
            { error: "SERVICE_NOT_FOUND" });
    }

    // Format the Request.

    const request = buildRequest(data);

    // Response

    let responseObject: any = {};

    // Start the process

    try {

        // Routes

        try {

            // Get the controller

            const controllerPrototype = currentRoute.controller as any;

            // Make the instance

            const controllerInstance = new controllerPrototype.constructor();

            // Get the Controller and make the call.

            responseObject = await controllerInstance[currentRoute.handlerName](request);

        } catch (error: ControllerException) {

            let eObject: any = {};

            if (error.code && error.error) {

                // Object is completed

                eObject = error;

            } else if (error.message) {

                GameLogger.error(undefined, error);

                try {

                    eObject = JSON.parse(error.message);

                } catch (e: ControllerException) {

                    eObject = { code: 500, error: error.message };
                }

            } else {

                eObject = { code: 500, error: error };
            }

            return BaseController.response(data, eObject.code,
                { error: eObject.error });
        }

        // Response.

        if (responseObject && responseObject.responseType) {

            return BaseController.typedResponse(data, responseObject.responseType,
                200, responseObject.body);

        } else if (responseObject && responseObject.code == "ERROR") {

            return BaseController.response(data, responseObject.reason.code,
                responseObject.reason);

        } else {

            return BaseController.response(data, 200,
                responseObject ? responseObject : {
                    code: "NOT_FOUND",
                    reason: "This is " + data.httpMethod
                });
        }

    } catch (e: ControllerException) {

        GameLogger.error(undefined, e.stack || e);

        return {
            statusCode: 500,
            body: JSON.stringify({
                code: "ERROR",
                reason: "There was an error, please contact with the administrator."
            }),
            headers: {}
        };

    } finally {

        // Logging and Timing

        if (responseObject?.code) {

            const elapsedTime = Utils.millisecondsToTime(
                Date.now() - requestStartTime);

            GameLogger.info(undefined, "[ Response ] "
                + elapsedTime + " | " + data.httpMethod + " | " + data.path);
        }
    }
}
