import { getEnvironment } from "../environment";
import { ControllerHttpMethod } from "../types";

/**
 * SwaggerEndpoint
 */
export type SwaggerEndpoint = {
    tag: string,
    method: ControllerHttpMethod,
    path: string,
    description: string
};

/**
 * generateSwagger
 */
export function generateSwagger(routes: SwaggerEndpoint[]) {

    const paths: any = {};

    routes.forEach(route => {

        if (!paths[route.path]) {
            paths[route.path] = {};
        }

        const pathParams = [...route.path.matchAll(/{(\w+)}/g)].map(match => ({
            name: match[1],
            in: "path",
            required: true,
            schema: { type: "string" },
            description: `Path parameter: ${match[1]}`
        }));

        const pathObject: any = {
            tags: [route.tag],
            parameters: pathParams,
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object"
                            }
                        }
                    }
                }
            }
        };

        if (route.description) {
            pathObject.summary = route.description;
            pathObject.description = "Performs '" + route.description + "' action."
        }

        paths[route.path][route.method.toLowerCase()] = pathObject;
    });

    const environment = getEnvironment();

    return {
        openapi: "3.0.0",
        info: {
            title: environment.projectName,
            description: environment.projectDescription,
            version: environment.projectVersion
        },
        paths
    };
}