
class InputPlugin(object):

    inputs = {}

    @classmethod
    def register_plugin(self_class, input_plugin, name):
        assert isinstance(input_plugin, InputPlugin)
        assert isinstance(name, str), 'name must be a string'
        self_class.inputs[name] = input_plugin

    def __init__(self, name, event_handler):
        assert event_handler, 'event_handler function must be provided'  #  and hasattr(event_handler, '__call__')
        self.event_handler = event_handler
        self.register_plugin(self, name)

    def open(self):
        assert False, 'must be implemented'

    def close(self):
        assert False, 'must be implemented'
