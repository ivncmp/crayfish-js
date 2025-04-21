/**
* BaseService
*/
export abstract class BaseService {

    /**
     * toObject
     */
    static toObject(any: any) {

        const json = JSON.stringify(any);
        return JSON.parse(json);
    }
}