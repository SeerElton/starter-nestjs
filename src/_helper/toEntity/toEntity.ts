import { Injectable } from "@nestjs/common";

@Injectable()
export class toEntity {
    public create<T>(source: any): T {
        const newObject: any = {};
        for (const property in source) {
            if (source.hasOwnProperty(property)) {

                const newPropertyName = property.charAt(0).toUpperCase() + property.slice(1);
                newObject[newPropertyName] = source[property];
            }
        }
        return newObject as T;
    }

    public produce<T>(source: any): T {
        const newObject: any = {};
        for (const property in source) {
            if (source.hasOwnProperty(property)) {
                let newPropertyName;
                if (this.isAllCaps(property)) {
                    continue;
                } else {
                    newPropertyName = property.charAt(0).toLowerCase() + property.slice(1);
                }
                newPropertyName = property.charAt(0).toLowerCase() + property.slice(1);
                newObject[newPropertyName] = source[property];
            }
        }
        return newObject as T;
    }

    public isAllCaps(str) {
        return str === str.toUpperCase();
    }
}