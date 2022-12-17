import fetch2 from './fetch2';
function isArray (value: unknown): value is [] {
    return Array.isArray(value);
}
function isObject (value: unknown): value is Obj {
    return typeof value === 'object' &&
        value !== null &&
        value.constructor === Object &&
        Object.prototype.toString.call(value) === '[object Object]';
}
function isArrayOrObject (value: unknown): value is ([] | Obj) {
    return isObject(value) || isArray(value);
}
function isEqual (lhs: any, rhs: any):boolean {
    if (Object.keys(lhs).length !== Object.keys(rhs).length) { return false; }
    for (const [key, value] of Object.entries(lhs)) {
        const rightValue = rhs[key];
        if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
            if (isEqual(value, rightValue)) { continue; }
            return false;
        }
        if (value !== rightValue) { return false; }
    }
    return true;
}
function freeze (obj: any):any {
    if (isObject(obj)) {
        Object.freeze(obj);
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                freeze(obj[key]);
        }
    }
    if (isArray(obj)) {
        Object.freeze(obj);
        for (let key of obj) {
            freeze(key);
        }
    }
    return obj;
}
function merge (lhs: Obj, rhs: Obj): Obj {
    if (isObject(lhs) && isObject(rhs)) {
        for (const key in rhs) {
            if (isObject(rhs[key])) {
                if (!lhs[key]) { Object.assign(lhs, { [key]: {} }); }
                lhs[key] = merge(<Obj>lhs[key], <Obj>rhs[key]);
            } else {
                Object.assign(lhs, { [key]: rhs[key] });
            }
        }
    }
    return lhs
}
export {
    isObject,
    isArray,
    isArrayOrObject,
    isEqual,
    fetch2,
    merge,
    freeze
}
