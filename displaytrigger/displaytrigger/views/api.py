from pyramid.response import Response
from pyramid.view import view_config


@view_config(route_name='api')
def api(request):
    """
    Take GET/POST application/x-form or application/json
    Normalize the input
    push to websocket
    """
    return Response()
