/* global HOST_STATIC_PORT */

export function static_url(path) {
    if (path && path.indexOf('://')>=0) {return path;}
    return `http://${window.location.hostname}:${HOST_STATIC_PORT}${path}`;
}


export function getUrlParameter(sParam) {
    //http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return '';
}


export function get_attr(cmd, obj, fallback_return) {
    if (typeof(cmd) == 'string') {cmd = cmd.split('.');}
    if (cmd.length == 1) {return obj[cmd.shift()];}
    if (cmd.length > 1) {
        var next_cmd = cmd.shift();
        var next_obj = obj[next_cmd];
        if (typeof(next_obj) == 'undefined') {
            //console.error(""+obj+" has no attribute "+next_cmd);
            return fallback_return;
        }
        return get_attr(cmd, next_obj, fallback_return);
    }
    //console.error('Failed to aquire ');
    return fallback_return;
}
export function get_func(cmd, obj) {return get_attr(cmd, obj, function(){})}
export function get_obj(cmd, obj) {return get_attr(cmd, obj, {})}
