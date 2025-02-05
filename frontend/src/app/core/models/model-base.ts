import { deserialize, serialize, ClassType } from '../helpers';

export abstract class ModelBase {

    /**
    * Converts the instance to a JSON string.
    * Handles circular references.
    */
    toJson(): string {
        return serialize(this);
    }

    /**
    * Creates an instance of the class from a JSON object or string.
    * Infers the class type from the current `ModelBase` subclass.
    * @param data - The JSON data (string or object).
    */
    static fromJson<T>(this: ClassType<T>, data: any): T | null {
        const instance = deserialize(data, this);
        if (instance === null) {
            console.error('Deserialization failed: invalid data or class type.');
        }
        return instance;
    }
}

