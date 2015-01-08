import pygame
import pygame.midi

from input_ import InputPlugin

from pygame_midi_wrapper import PygameMidiDeviceHelper
from music import midi_status, note_to_text, MidiStatus

class MidiInputPlugin(InputPlugin):

    def __init__(self, event_handler, options):
        super().__init__('midi', event_handler)
        self.midi_port_name = options.get('midi_port_name')

    def open(self):
        pygame.init()
        pygame.display.set_caption(__name__)
        pygame.event.set_blocked(pygame.MOUSEMOTION)

        pygame.fastevent.init()
        self.event_get = pygame.fastevent.get
        self.event_post = pygame.fastevent.post

        pygame.midi.init()
        self.midi_input = PygameMidiDeviceHelper.open_device(self.midi_port_name, 'input')

        #pygame.display.set_mode((1, 1))
        self.run()

    def run(self):
        going = True
        while going:
            events = self.event_get()
            for e in events:
                if e.type == pygame.QUIT or (e.type == pygame.KEYDOWN and e.key == pygame.K_ESCAPE):
                    going = False
                if e.type in [pygame.midi.MIDIIN]:
                    status = midi_status(e.status)
                    # Normalize note_off events - data2 is the velocity. Velocity 0 -> note_off
                    if status.name == 'note_on' and e.data2 == 0:
                        status = MidiStatus(code=0x8, name='note_off', channel=status.channel)
                    # Special case to stringify 'note_on' events
                    if status.name == 'note_on':
                        self.event_handler('{0}-{1}'.format(status.name, note_to_text(e.data1)))
                    # Pass though all other events
                    else:
                        self.event_handler('{0}-{1}-{2}-{3}'.format(status.name, e.data1, e.data2, e.data3))

            if self.midi_input.poll():
                for midi_event in pygame.midi.midis2events(self.midi_input.read(10), self.midi_input.device_id):
                    self.event_post(midi_event)

        self.close()

    def close(self):
        del self.midi_input
        pygame.midi.quit()

