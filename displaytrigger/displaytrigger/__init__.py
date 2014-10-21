from pyramid.config import Configurator

from externals.lib.misc import convert_str_with_type


def main(global_config, **settings):
    config = Configurator(settings=settings)

    # Parse/Convert setting keys that have specifyed datatypes
    for key in config.registry.settings.keys():
        config.registry.settings[key] = convert_str_with_type(config.registry.settings[key])

    config.include('pyramid_mako')

    config.add_static_view(name='static', path='static')  # , cache_max_age=3600
    config.add_static_view(name='ext', path=settings['static.path.ext'], cache_max_age=3600)

    config.add_route('index', '/')
    config.add_route('api', '/api')

    config.scan()
    return config.make_wsgi_app()
