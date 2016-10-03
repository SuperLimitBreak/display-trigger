
export function static_url(path) {
    if (path && path.indexOf('://')>=0) {return path;}
    return `${window.location.hostname}:${HOST_STATIC_PORT}${path}`;
}
