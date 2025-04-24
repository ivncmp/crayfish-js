// Route definition

import { Environment, setEnvironment } from "./environment";
import { BaseController } from "./base/base-controller";
import { getRouteRegistry, Route } from "./decorator";
import { CrayfishLogger } from "./logger";
import { Utils } from "./utils";

import {
    ControllerEvent, ControllerException, ControllerRequest,
    ProviderRequest
} from "./types";

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
 * extractPathVariables
 */
function extractPathVariables(route: string, url: string): { [key: string]: string } {

    const routeParts = route.split('/').filter(part => part);

    const basePath = url.split('?').filter(part => part);
    const urlParts = basePath[0].split('/').filter(part => part);

    const vars: { [key: string]: string } = {};

    for (let i = 0; i < routeParts.length; i++) {

        if (routeParts[i].startsWith('{') && routeParts[i].endsWith('}')) {

            const varName = routeParts[i].slice(1, -1);

            if (urlParts[i]) {
                vars[varName] = urlParts[i];
            }
        }
    }

    return vars;
}

/**
 * buildRequest
 */
function buildRequest(route: Route, event: ControllerEvent): ControllerRequest {

    // Request info.

    const local = event.local ? event.local : false;
    const domain = event.requestContext && event.requestContext.domainPrefix
        ? event.requestContext.domainPrefix : "localhost";
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
    const pathParameters = extractPathVariables(
        route.path, event.path);

    const clientIp = headers && headers['X-Forwarded-For'] ?
        headers['X-Forwarded-For'] : headers['x-forwarded-for'] ?
            headers['x-forwarded-for'] : "0.0.0.0";

    // Return it.

    return {
        local, rawBody, body, headers, httpMethod,
        queryParameters, pathParameters, domain, clientIp
    }
}

// Handle Requests

export async function handleRequest(data: ProviderRequest) {

    // Request Logic

    const requestStartTime = Date.now();

    // Options call

    if (data.httpMethod == "OPTIONS") {
        return BaseController.response(data, 200, {});
    }

    // Build Environment

    const environment = await Utils.importEnvironment(
        process.env.ENVIRONMENT || "prod") || Environment.default();

    setEnvironment(environment);

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

    const currentRoute = matchingRoutes.length > 0
        ? matchingRoutes[0].route : null;

    // API Documentation

    if (!currentRoute && data.path == "/") {
        return BaseController.documentation(data);
    }

    // Not found

    if (!currentRoute || !currentRoute.controller) {
        return BaseController.response(data, 404,
            { error: "SERVICE_NOT_FOUND" });
    }

    // Logging 

    CrayfishLogger.info(undefined, "[ Request ] "
        + new Date().toISOString() + " | " + data.httpMethod
        + " | " + data.path + " (" + currentRoute.description + ")");
    CrayfishLogger.info(undefined, "[ Headers ] "
        + new Date().toISOString() + " | Query Parameters: "
        + JSON.stringify(data.queryStringParameters)
        + " | Header Parameters: " + JSON.stringify(data.headers));

    // Not found

    if (!currentRoute) {
        return BaseController.response(data, 404,
            { error: "SERVICE_NOT_FOUND" });
    }

    // Format the Request.

    const request: ControllerRequest = buildRequest(currentRoute, data);

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

                CrayfishLogger.error(undefined, error);

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

        CrayfishLogger.error(undefined, e.stack || e);

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

            CrayfishLogger.info(undefined, "[ Response ] "
                + elapsedTime + " | " + data.httpMethod + " | " + data.path);
        }
    }
}
