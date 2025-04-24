import _ from "lodash";

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { getInjectionRegistry, getServiceRegistry } from "./decorator";
import { BaseService } from "./base/base-service";
import { BaseController } from "./base/base-controller";
import { Environment } from "./environment";

export class Utils {

    /**
     * millisecondsToTime
     */
    static millisecondsToTime(s: number) {

        var pad = (n: number, z = 2) => ('00' + n).slice(-z);

        return pad(s / 3.6e6 | 0) + ':'
            + pad((s % 3.6e6) / 6e4 | 0) + ':'
            + pad((s % 6e4) / 1000 | 0) + '.'
            + pad(s % 1000, 3);
    }

    /**
     * importEnvironments
     */
    static async importEnvironment(target: string, dirPath: string = "./"): Promise<Environment | null> {

        const files = readdirSync(dirPath)
            .filter((f: string) => !f.includes("node_modules"));

        for (const file of files) {

            const filePath = join(dirPath, file);
            const fileStat = statSync(filePath);

            if (fileStat.isDirectory()) {
                const found = await Utils.importEnvironment(target, filePath);
                if (found) return found;
            } else if (filePath.includes('environments/') && filePath.endsWith('.js')) {
                const environmentFile = await import(process.cwd() + "/" + filePath);
                if (environmentFile?.default?.name == target) {
                    return _.cloneDeep(environmentFile.default);
                }
            }
        }

        return null;
    }

    /**
     * importServices
     */
    static async importServices(dirPath: string = "./") {

        const files = readdirSync(dirPath)
            .filter((f: string) => !f.includes("node_modules"));

        for (const file of files) {

            const filePath = join(dirPath, file);
            const fileStat = statSync(filePath);

            if (fileStat.isDirectory()) {
                await Utils.importServices(filePath);
            } else if (filePath.includes('service/') && filePath.endsWith('.js')) {
                await import(process.cwd() + "/" + filePath);
            }
        }
    }

    /**
     * importControllers
     */
    static async importControllers(dirPath: string = "./") {

        const files = readdirSync(dirPath)
            .filter((f: string) => !f.includes("node_modules"));

        for (const file of files) {

            const filePath = join(dirPath, file);
            const fileStat = statSync(filePath);

            if (fileStat.isDirectory()) {
                await Utils.importControllers(filePath);
            } else if (filePath.includes('controller/') && filePath.endsWith('.js')) {
                await import(process.cwd() + "/" + filePath);
            }
        }
    }

    /**
     * injectDependencies
     */
    static async injectDependencies(clazz: BaseService | BaseController | undefined = undefined) {

        const serviceRegistry = getServiceRegistry();
        const injectionRegistry = getInjectionRegistry();

        const toProcess = clazz ? [clazz] : Object.values(serviceRegistry);

        for (const item of toProcess) {

            const target = Object.getPrototypeOf(item);
            const injections = injectionRegistry[target.constructor.name] || [];

            for (const propName of injections) {

                const dependencyType: any = Reflect.getMetadata(
                    'design:type', target, propName) as BaseService;

                if (dependencyType && serviceRegistry[dependencyType.name]) {
                    (item as any)[propName] = serviceRegistry[dependencyType.name];
                }
            }
        }
    }
}