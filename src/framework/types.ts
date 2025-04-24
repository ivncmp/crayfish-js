/**
 * Framework Types
 */

export type ControllerHttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS";

export type ProviderRequest = any;

export type ControllerRequest = {
    local: boolean,
    rawBody: string,
    body: any,
    headers: { [key: string]: string },
    httpMethod: ControllerHttpMethod,
    queryParameters: { [key: string]: string },
    pathParameters: { [key: string]: string },
    domain: string,
    clientIp: string
};

export type ControllerResponse = any;
export type ControllerException = any;
export type ControllerEvent = any;

export type LoggerOrigin = any;