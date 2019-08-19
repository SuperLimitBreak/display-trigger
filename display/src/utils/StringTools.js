import { isObject } from 'calaldees_libs/es6/core';


export function parseDimension(value, parentElement, lookupElements) {
    if (typeof(value) !== 'string') {return value;}

    // Parse String
    let [__, number, unit] = value.match(/((?:[\d]+\.)?[\d]+)([^\d\s]{1,3})(?:\s|$)?/) || [undefined, undefined, undefined];
    if (number == undefined) {return value;}
    number = Number(number);
    if      (!unit) {}
    else if (unit == 'vh') {number = number * parentElement.clientHeight;}
    else if (unit == 'vw') {number = number * parentElement.clientWidth;}
    else {
        console.warn(`Unsupported unit ${unit} in ${value}`);
        return value;
    }

    // Modify with +/- image sizes
    const [_value, sign, element_name, element_attr] = value.match(/([+-])(\S+)\.(width|height)?/) || [undefined, undefined, undefined];
    if (element_name && lookupElements && lookupElements.size && lookupElements.get) {
        number += lookupElements.get(element_name)[element_attr] * (sign=='-' ? -1 : 1);
    }

    return number;
}


function _bindRecursivelyReplaceStringsWithObjectReferences(stringMapLookup, funcParseDimension) {
    function __r(value) {
        if (typeof(value) === 'string') {
            // Identify Element - lookup
            for (const [STRING_IDENTIFIER, mapLookup] of stringMapLookup.entries()) {
                const match = value.match(`${STRING_IDENTIFIER}(.*?)(\\s|$)`)
                if (match && match[1]) {
                    const valueToLookup = match[1];
                    return mapLookup.get(valueToLookup);
                }
            }

            return funcParseDimension(value);
        }
        else if (isObject(value)) {
            for (const [_key, _value] of Object.entries(value)) {
                value[_key] = __r(_value);
            }
        }
        else if (Array.isArray(value)) {
            value = value.map(__r);
        }
        return value;
    }
    return __r;
}
export function bindRecursivelyReplaceStringsWithObjectReferences(stringMapLookup, parentElement) {
    console.assert(stringMapLookup && stringMapLookup.size && stringMapLookup.get, 'stringMapLookup Map required', stringMapLookup);
    console.assert(parentElement && parentElement.clientWidth && parentElement.clientHeight, 'partentElement required', parentElement);
    const funcParseDimension = (value) => parseDimension(value, parentElement, stringMapLookup.get('element::'));
    return _bindRecursivelyReplaceStringsWithObjectReferences(stringMapLookup, funcParseDimension);
}
