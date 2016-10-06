import os
import json

from pyramid.response import Response
from pyramid.view import view_config

import logging
log = logging.getLogger(__name__)


@view_config(route_name='event')
def event(request):
    """
    Take GET/POST application/x-form or application/json
    Normalize the input
    push to websocket
    Commandline example:
        curl -XGET http://localhost:6543/event/screen_size.set -d '{"deviceid": "main", "top":"100px", "left":"100px", "width": "400px", "height":"300px"}'
    """
    cmd = {}
    cmd.update(request.matchdict)
    cmd.update(request.params)
    try:
        cmd.update(json.loads(request.text))
    except json.decoder.JSONDecodeError:
        pass
    if cmd:
        cmd = {'action': 'message', 'data': [cmd]}
        log.debug("remote command - {0}".format(cmd))
        request.registry['socket_manager'].recv(json.dumps(cmd).encode('utf8'))
    return Response()


@view_config(route_name='event_map')
def event_map(request):
    path = request.registry.settings.get('path.eventmap')
    event_map = request.matchdict['event_map']
    if event_map:
        with open(os.path.join(path, event_map), 'r') as f:
            data = json.load(f)
    else:
        data = [ff for ff in os.listdir(path) if ff.endswith('.json')]

    request.response.text = json.dumps(data)
    request.response.content_type = "application/json; charset=utf-8"
    return request.response
