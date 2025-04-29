/**
* BaseModel
*/
export abstract class BaseModel {

    /**
     * toObject
     */
    static toObject(any: any) {

        const json = JSON.stringify(any);
        return JSON.parse(json);
    }
}