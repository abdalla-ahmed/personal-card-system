import moment from "moment";

export type ClassType<T> = { new(...args: any[]): T };
export type ClassTypeMap<T> = Record<string, ClassType<T>>;

/**
 * Recursively reconstructs objects with their associated classes.
 *
 * Author: Andallah Elsayed
 */
export function deserialize<T>(
    data: any | string,
    classType: ClassType<T>,
    classMap?: ClassTypeMap<any>
): T | null {
    if (!data || (typeof data !== 'object' && typeof data !== 'string')) {
        console.error("Invalid input data. Expected an object or a JSON string.");
        return null;
    }

    let parsedData: any;
    try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
        console.error("Failed to parse JSON string:", error);
        return null;
    }

    const visited = new WeakMap();

    function mapToClass(obj: any, classType: ClassType<T>, classMap: ClassTypeMap<any>): any {
        if (visited.has(obj)) return visited.get(obj);

        // Handle arrays recursively
        if (Array.isArray(obj)) {
            return obj.map(item => mapToClass(item, classType, classMap));
        }

        // Handle plain objects
        if (obj !== null && typeof obj === 'object') {
            const instance = new classType();
            visited.set(obj, instance);

            for (const key of Object.keys(obj)) {

                const value = obj[key];

                if (classMap?.hasOwnProperty(key)) {
                    // Map the value to the associated class in classMap
                    instance[key] = mapToClass(value, classMap[key], classMap);
                } else if (Array.isArray(value)) {
                    // Map arrays recursively
                    instance[key] = value.map(item =>
                        typeof item === 'object' ? mapToClass(item, item.constructor, classMap) : item
                    );
                } else if (typeof value === 'object' && value !== null) {
                    // Recursively map nested objects
                    instance[key] = mapToClass(value, value.constructor, classMap);
                } else if (typeof value === 'string') {
                    // Check if the value is a valid ISO date string
                    const dateValue = moment(value, moment.ISO_8601, true);
                    instance[key] = dateValue.isValid() ? dateValue.toDate() : value;
                } else {
                    // Assign primitive values directly
                    instance[key] = value;
                }
            }

            return instance;
        }

        // Return primitive values as is
        return obj;
    }

    return mapToClass(parsedData, classType, classMap);
}
