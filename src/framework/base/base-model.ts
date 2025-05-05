/**
* BaseModel
*/
import { ControllerRequest } from "../types";

export type ModelData = any;

export abstract class BaseModel {

    abstract unmarshall(modelData: ModelData): any;
    abstract marshall(modelData: ModelData): any;

    /**
     * toObject
     */
    static toObject(any: any) {

        const json = JSON.stringify(any);
        return JSON.parse(json);
    }
}