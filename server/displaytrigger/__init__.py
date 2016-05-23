import time
import threading
import urllib.request
from pyramid.config import Configurator

from libs.misc import convert_str_with_type
from libs.subscription_server import SubscriptionEchoServerManager

import logging
log = logging.getLogger(__name__)


try:
    import dbus
    import dbus.service
    import dbus.mainloop.glib
    from gi.repository import Gtk

    DBUS_SUPPORTED = True
except ImportError as e:
    log.warning(e)
    log.warning("'%s' not installed, systemd notification unsupported" % e.name)
    DBUS_SUPPORTED = False

EXCEPTION_NUMBER_ADDRESS_ALREADY_IN_USE = 48


def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include('pyramid_mako')

    # Parse/Convert setting keys that have specifyed datatypes
    for key in config.registry.settings.keys():
        config.registry.settings[key] = convert_str_with_type(config.registry.settings[key])

    # Notify Systemd on supported systems
    if DBUS_SUPPORTED and config.registry.settings.get("systemd.dbus.notification", "").lower() == "true":
        log.info("Notifying systemd when service starts OK")
        def service_running_ok():
            try:
                response = urllib.request.urlopen("http://localhost:6543/display/display.html")
                return response.getcode() == 200
            except urllib.error.URLError:
                return False

        def notify_systemd():
            dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
            bus_name = dbus.service.BusName("org.SuperLimitBreak.displaytrigger", dbus.SessionBus())
            dbus.service.Object(bus_name, "/tmp/superlimitbreak_displaytrigger")
            Gtk.main()

        def notify_systemd_when_service_running():
            while not service_running_ok():
                time.sleep(1)
            log.info("Service started OK, notifying systemd")
            notify_systemd()

        threading.Thread(target=notify_systemd_when_service_running).start()

    # TCP/Websocket
    try:
        socket_manager = SubscriptionEchoServerManager(
            websocket_port=config.registry.settings['multisocket.websocket.port'],
            tcp_port=config.registry.settings['multisocket.tcp.port'],
        )
        config.registry['socket_manager'] = socket_manager
        socket_manager.start()
    except OSError as ex:
        if ex.errno == EXCEPTION_NUMBER_ADDRESS_ALREADY_IN_USE:
            log.warn('Another tcp/websocket server already exists')
        else:
            raise ex

    config.add_static_view(name='static', path='static')  # , cache_max_age=3600
    config.add_static_view(name='ext', path=settings['path.static.ext'], cache_max_age=3600)
    config.add_static_view(name='trigger', path=settings['path.static.trigger'])
    config.add_static_view(name='display', path=settings['path.static.display'])
    config.add_static_view(name='assets', path=settings['path.static.assets'], cache_max_age=60*60*24)

    config.add_route('index', '/')
    config.add_route('event', '/event/{func:.*}')
    config.add_route('event_map', '/event_map/{event_map:.*}')

    config.scan()
    return config.make_wsgi_app()
