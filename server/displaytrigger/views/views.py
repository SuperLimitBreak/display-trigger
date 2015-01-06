from pyramid.view import view_config
from pyramid.renderers import render_to_response


@view_config(route_name='index')
def my_view(request):
    context = {
        'project': 'display-trigger'
    }

    return render_to_response('index.mako', context, request=request)
