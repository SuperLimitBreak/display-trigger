from pyramid.view import view_config


@view_config(route_name='index', renderer='templates/index.mako')
def my_view(request):
    return {'project': 'display-trigger'}
