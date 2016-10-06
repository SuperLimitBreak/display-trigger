import os
import json

from pyramid.view import view_config

import logging
log = logging.getLogger(__name__)


@view_config(route_name='display_config')
def display_config(request):
    path = request.registry.settings.get('path.display_configs')
    display_config = request.matchdict['display_config']
    if display_config:
        with open(os.path.join(path, display_config), 'r') as f:
            data = json.load(f)
    else:
        data = [ff for ff in os.listdir(path) if ff.endswith('.json')]

    request.response.text = json.dumps(data)
    request.response.content_type = "application/json; charset=utf-8"
    request.response.headerlist.append(('Access-Control-Allow-Origin', '*'))
    return request.response
