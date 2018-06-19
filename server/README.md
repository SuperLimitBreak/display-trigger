The original server was a heavy python experiment

The server2 is a microservice set of docker containers

serving static content moved to `nginx`
Pyramid API bits
 - `event` moved to `libs` URLSubscriptionBridge
 - `json` listings moved to `nginx` with http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format
