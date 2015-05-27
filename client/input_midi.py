from input_ import InputPlugin

from libs.music import note_to_text, MidiStatus
from libs.pygame_midi_input import MidiInput


class MidiInputPlugin(MidiInput, InputPlugin):

    def __init__(self, event_handler, options):
        InputPlugin.__init__(self, 'midi', event_handler)
        MidiInput.__init__(self, options.get('midi_port_name'))

    def open(self):
        MidiInput.init_pygame(self)
        self.run()

    def midi_event(self, status, data1, data2, data3):
        # Normalize note_off events - data2 is the velocity. Velocity 0 -> note_off
        if status.name == 'note_on' and data2 == 0:
            status = MidiStatus(code=0x8, name='note_off', channel=status.channel)
        # Special case to stringify 'note_on' events
        if status.name == 'note_on':
            self.event_handler('{0}-{1}'.format(status.name, note_to_text(data1)))
        # Pass though all other events
        else:
            self.event_handler('{0}-{1}-{2}-{3}'.format(status.name, data1, data2, data3))
