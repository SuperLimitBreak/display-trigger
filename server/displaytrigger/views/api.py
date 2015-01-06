from pyramid.response import Response
from pyramid.view import view_config

import logging
log = logging.getLogger(__name__)


@view_config(route_name='api')
def api(request):
    """
    Take GET/POST application/x-form or application/json
    Normalize the input
    push to websocket
    """
    cmd = request.params.get('cmd')
    if cmd:
        log.debug("remote command - {0}".format(cmd))
        request.registry['socket_manager'].recv(cmd.encode('utf-8'))
    return Response()

