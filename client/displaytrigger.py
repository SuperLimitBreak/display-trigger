

import logging
log = logging.getLogger(__name__)

VERSION = '0.1'

DEFAULT_DISPLAY_HOST = 'localhost'
DEFAULT_MIDI_PORT_NAME = 'displaytrigger'


# Event handler ----------------------------------------------------------------

def event_handler(name):
    print(name)


# Input Plugins ----------------------------------------------------------------

from input_ import InputPlugin

import input_keyboard
input_keyboard.KeyboardInputPlugin(event_handler)

import input_midi
input_midi.MidiInputPlugin(event_handler)


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

    parser_input.add_argument('--input_device', choices=InputPlugin.inputs.keys(), help='input device', default='keyboard')
    parser_input.add_argument('--display_host', action='store', help='ip adress and port for remote TCP display events', default=DEFAULT_DISPLAY_HOST)

    parser.add_argument('--midi_port_name', action='store', help='Input port name to attach too', default=DEFAULT_MIDI_PORT_NAME)

    parser.add_argument('--log_level', type=int,  help='log level', default=logging.INFO)
    parser.add_argument('--version', action='version', version=VERSION)

    args = parser.parse_args()

    return vars(args)


if __name__ == "__main__":
    args = get_args()
    logging.basicConfig(level=args['log_level'])

    InputPlugin.inputs[args['input_device']].open()
