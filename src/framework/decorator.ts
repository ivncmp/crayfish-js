// Route definition

import 'reflect-metadata';

import { BaseController } from './base/base-controller';
import { BaseService } from './base/base-service';

// Types

export enum Method {
    NOT_DEFINED = "NOT_DEFINED",
    OPTIONS = "OPTIONS",
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

export enum MetaType {
    NAME = "NAME",
    DESCRIPTION = "DESCRIPTION"
}

// Types

type PendingRoute = {
    target: Function;
    propertyKey: string;
    path: string;
    method: Method,
    description: string
};

export type Route = {
    path: string;
    method: Method;
    controller: BaseController,
    handlerName: string,
    description: string
};

// Routes Initalization

const pendingRoutes: PendingRoute[] = [];
const routeRegistry: Route[] = [];
const serviceRegistry: { [key: string]: BaseService } = {};
const injectionRegistry: { [key: string]: string[] } = {};

/**
 * getTargetKey
 */
function getTargetKey(target: any, propertyKey: any) {

    return target.constructor.name + "." + propertyKey.toString();
}

/**
 * Service Decorator
 */
export function Service(): ClassDecorator {

    return (target: any) => {
        serviceRegistry[target.name] = new target();
    };
}

/**
 * Controller Decorator
 */
export function Controller(basePath: string = ''): ClassDecorator {

    return (target) => {

        Reflect.defineMetadata('basePath', basePath, target);

        pendingRoutes
            .filter((route) => route.target === target.prototype)
            .forEach((route) => {
                routeRegistry.push({
                    path: `${basePath}${route.path}`,
                    method: route.method,
                    controller: target.prototype as BaseController,
                    handlerName: route.propertyKey,
                    description: route.description
                });
            });
    };
}

/**
 * Endpoint Decorator
 */
export function Endpoint(method: Method, path: string): MethodDecorator {

    return (target, propertyKey) => {

        const findRoute = pendingRoutes.find(
            r => getTargetKey(r.target, r.propertyKey) == getTargetKey(target, propertyKey)
        );

        if (findRoute) {

            findRoute.path = path;
            findRoute.method = method;

        } else {

            pendingRoutes.push({
                target: target.constructor.prototype,
                propertyKey: propertyKey as string,
                path, method, description: "Unnamed Service"
            });
        }
    };
}

/**
 * Metadata Decorator
 */
export function Meta(type: MetaType, value: string): MethodDecorator {

    return (target, propertyKey) => {

        const findRoute = pendingRoutes.find(
            r => getTargetKey(r.target, r.propertyKey) == getTargetKey(target, propertyKey)
        );

        if (findRoute) {

            if (type == MetaType.DESCRIPTION) {
                findRoute.description = value;
            }

        } else {

            pendingRoutes.push({
                target: target.constructor.prototype,
                propertyKey: propertyKey as string,
                path: "", method: Method.NOT_DEFINED,
                description: value
            });

        }
    };
}

/**
 * Inject Decorator
 */
export function Inject(): PropertyDecorator {

    return (target, propertyKey) => {

        const propertyType = Reflect.getMetadata('design:type', target, propertyKey);

        Reflect.defineMetadata('design:type', propertyType, target, propertyKey);
        Reflect.defineMetadata('injectable', true, target, propertyKey);

        if (!injectionRegistry[target.constructor.name]) {
            injectionRegistry[target.constructor.name] = [];
        }

        injectionRegistry[target.constructor.name]
            .push(propertyKey as string);
    };
}

/**
 * getRouteRegistry
 */
export function getRouteRegistry() {

    return routeRegistry;
}

/**
 * getServiceRegistry
 */
export function getServiceRegistry() {

    return serviceRegistry;
}

/**
 * getInjectionRegistry
 */
export function getInjectionRegistry() {

    return injectionRegistry;
}
