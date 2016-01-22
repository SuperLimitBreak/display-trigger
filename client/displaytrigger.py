import json
from functools import partial
from collections import defaultdict

from input_plugin import InputPlugin
from libs.client_reconnect import SubscriptionClient

import logging
log = logging.getLogger(__name__)

VERSION = '0.11'

DEFAULT_DISPLAY_HOST = 'localhost:9872'
DEFAULT_MIDI_PORT_NAME = 'displaytrigger'
DEFAULT_MAP_FILENAME = 'event_map.json'  # '{0}.json'.format(os.path.splitext(__file__)[0])

INPUT_PLUGINS = ('console', 'keyboard', 'midi')  # TODO - make this more dynamic, don't likey this constant here


# Event Handler ----------------------------------------------------------------

def generate_event_lookup(data):
    """
    Create a lookup table
    """
    event_lookup = defaultdict(list)
    for item in data:
        for event in item['events']:
            event_lookup[event].append(item)
    return event_lookup


def event_handler(send_message_func, event_lookup, event_key):
    """
    Typically called with a partial function to consistanty pass
    display_event_func and event_lookup (globals are bad and the functional paragdime is nice)
    """
    if event_key not in event_lookup:
        log.warn('unknown event {0}'.format(event_key))
        return
    for event_item in event_lookup[event_key]:
        send_message_func(*event_item['payload'])


# Input Plugins ----------------------------------------------------------------

def init_input_plugins(event_handler_func, options):

    import input_plugin.console
    input_plugin.console.ConsoleInputPlugin(event_handler_func, options)

    try:
        import input_plugin.keyboard
        input_plugin.keyboard.KeyboardInputPlugin(event_handler_func, options)

        import input_plugin.midi
        input_plugin.midi.MidiInputPlugin(event_handler_func, options)
    except ImportError:
        # Startup should not be dependent on pygame being installed
        log.error('Unable setup keyboard and midi plugins. Possible pygame is not installed')


# Main -------------------------------------------------------------------------

def get_args():
    """
    Command line argument handling
    """
    try:
        return get_args_argparse()
    except ImportError:
        return get_args_optparse()


def get_args_argparse():
    import argparse

    parser = argparse.ArgumentParser(
        prog=__name__,
        description="""Display Trigger Client

        """,
        epilog="""
        """
    )
    parser_input = parser

    parser_input.add_argument('--input_device', choices=INPUT_PLUGINS, help='input device', default='console')
    parser_input.add_argument('--display_host', action='store', help='ip adress and port for remote TCP display events', default=DEFAULT_DISPLAY_HOST)
    parser_input.add_argument('--event_map', type=argparse.FileType('r'), help='json file mapping event names to payloads', default=DEFAULT_MAP_FILENAME)

    parser.add_argument('--midi_port_name', action='store', help='Input port name to attach too', default=DEFAULT_MIDI_PORT_NAME)

    parser.add_argument('--log_level', type=int,  help='log level', default=logging.INFO)
    parser.add_argument('--version', action='version', version=VERSION)

    args = parser.parse_args()

    return vars(args)


def get_args_optparse():
    import optparse
    import codecs

    parser = optparse.OptionParser("usage: %prog [options] arg")

    parser.add_option("--input_device", default='console', choices=INPUT_PLUGINS)
    parser.add_option("--display_host", default=DEFAULT_DISPLAY_HOST)
    parser.add_option("--event_map", default=DEFAULT_MAP_FILENAME)
    parser.add_option('--midi_port_name', default=DEFAULT_MIDI_PORT_NAME)
    parser.add_option('--log_level', type=int, default=logging.INFO)

    (options, args) = parser.parse_args()
    options = vars(options)

    assert options['input_device'] in INPUT_PLUGINS
    options['event_map'] = codecs.open(options['event_map'], 'r', 'utf-8')

    return options


# Main -------------------------------------------------------------------------

if __name__ == "__main__":
    options = get_args()
    logging.basicConfig(level=options['log_level'])

    event_lookup = generate_event_lookup(json.load(options['event_map']))
    socket = SubscriptionClient(*options['display_host'].split(':'), subscriptions=('none',))

    _event_handler = partial(event_handler, socket.send_message, event_lookup)

    init_input_plugins(_event_handler, options)

    InputPlugin.inputs[options['input_device']].open()

    socket.close()
