
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
