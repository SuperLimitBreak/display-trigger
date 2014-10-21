from pyramid.config import Configurator


def main(global_config, **settings):
    config = Configurator(settings=settings)

    config.include('pyramid_mako')

    config.add_static_view(name='static', path='static', cache_max_age=3600)
    config.add_static_view(name='ext', path=settings['static.path.ext'], cache_max_age=3600)

    config.add_route('index', '/')
    config.add_route('api', '/api')

    config.scan()
    return config.make_wsgi_app()
