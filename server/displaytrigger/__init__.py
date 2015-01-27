from pyramid.config import Configurator

from externals.lib.misc import convert_str_with_type
from externals.lib.multisocket.multisocket_server import EchoServerManager

import logging
log = logging.getLogger(__name__)


def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include('pyramid_mako')

    # Parse/Convert setting keys that have specifyed datatypes
    for key in config.registry.settings.keys():
        config.registry.settings[key] = convert_str_with_type(config.registry.settings[key])

    # TCP/Websocket
    socket_manager = EchoServerManager(
        websocket_port=config.registry.settings['multisocket.websocket.port'],
        tcp_port=config.registry.settings['multisocket.tcp.port'],
    )
    config.registry['socket_manager'] = socket_manager
    socket_manager.start()

    config.add_static_view(name='static', path='static')  # , cache_max_age=3600
    config.add_static_view(name='ext', path=settings['static.path.ext'], cache_max_age=3600)

    config.add_route('index', '/')
    config.add_route('event', '/event/{func:.*}')
    config.add_route('event_map', '/event_map/{event_map:.*}')

    config.scan()
    return config.make_wsgi_app()
