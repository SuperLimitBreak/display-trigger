import { isObject } from 'calaldees_libs/es6/core';


function normalizeElementDimension(element) {
    const _return = {
        width: element.width || element.clientWidth || 0,
        height: element.height || element.clientHeight || 0,
    }
    console.assert(_return.width && _return.height, 'unable to parse element dimension', element);
    return _return;
}


export function parseDimension(value, parentElement, lookupElements) {
    if (typeof(value) !== 'string') {return value;}
    // Parse String - the "\s|$|;" is important for not damaging "blur(10px)"
    let [__, number, unit] = value.match(/([+-]?(?:[\d]+\.)?[\d]+)(vh|vw|%|em|rem|px)(?:\s|$|;)/) || [undefined, undefined, undefined];
    if (number == undefined) {return value;}
    number = Number(number);
    if      (!unit || unit=='px') {}
    else if (unit == 'vh') {number = number * normalizeElementDimension(parentElement).height;}
    else if (unit == 'vw') {number = number * normalizeElementDimension(parentElement).width;}
    else {
        console.warn(`Unsupported unit ${unit} in ${value}`);
        return value;
    }

    // Modify with +/- image sizes
    // WARNING: This will not work on images that are loaded in the same json payload as the width/height are not known.
    // For this the function, images should be pre-loaded by an earlyer trigger
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
    console.assert(stringMapLookup && typeof(stringMapLookup.size) == 'number' && stringMapLookup.get, 'stringMapLookup Map required', stringMapLookup);

    const funcParseDimension = (value) => parseDimension(value, parentElement, stringMapLookup.get('element::'));
    return _bindRecursivelyReplaceStringsWithObjectReferences(stringMapLookup, funcParseDimension);
}
