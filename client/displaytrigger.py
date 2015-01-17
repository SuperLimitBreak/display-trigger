import json
from functools import partial

from input_ import InputPlugin
from network_display_event import DisplayEventHandler

import logging
log = logging.getLogger(__name__)

VERSION = '0.1'

DEFAULT_DISPLAY_HOST = 'localhost:9872'
DEFAULT_MIDI_PORT_NAME = 'displaytrigger'
DEFAULT_MAP_FILENAME = 'event_map.json'  # '{0}.json'.format(os.path.splitext(__file__)[0])

INPUT_PLUGINS = ('console', 'keyboard', 'midi')  # TODO - make this more dynamic, don't likey this constant here


# Event Handler ----------------------------------------------------------------

def generate_event_lookup(data):
    """
    Create a lookup table
    """
    event_lookup = {}
    for item in data:
        for event in item['events']:
            event_lookup[event] = item
    return event_lookup


def event_handler(display_event_func, event_lookup, event_key):
    """
    Typically called with a partial function to consistanty pass
    display_event_func and event_lookup (globals are bad and the functional paragdime is nice)
    """
    if event_key not in event_lookup:
        log.warn('unknown event {0}'.format(event_key))
        return
    event_item = event_lookup[event_key]
    display_event_func(
        event_item['func'],
        **event_item['params']
    )


# Input Plugins ----------------------------------------------------------------

def init_input_plugins(event_handler_func, options):

    import input_console
    input_console.ConsoleInputPlugin(event_handler_func, options)

    # TODO: try: import pygame - Startup should not be dependent on pygame being installed

    import input_keyboard
    input_keyboard.KeyboardInputPlugin(event_handler_func, options)

    import input_midi
    input_midi.MidiInputPlugin(event_handler_func, options)


# Main -------------------------------------------------------------------------

def get_args():
    """
    Command line argument handling
    """
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

def get_args():
	import codecs
	return dict(
		input_device='midi', #'midi',
		display_host='192.168.0.54:9872',
		midi_port_name=DEFAULT_MIDI_PORT_NAME,
		event_map=codecs.open(DEFAULT_MAP_FILENAME, 'r', 'utf-8'),
		log_level=logging.DEBUG,
	)

if __name__ == "__main__":
    options = get_args()
    logging.basicConfig(level=options['log_level'])
    
    event_lookup = generate_event_lookup(json.load(options['event_map']))
    display_event_handler = DisplayEventHandler.factory(*options['display_host'].split(':'))

    _event_handler = partial(event_handler, display_event_handler.event, event_lookup)

    init_input_plugins(_event_handler, options)
    InputPlugin.inputs[options['input_device']].open()

    display_event_handler.close()
