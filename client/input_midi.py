import pygame
import pygame.midi

from input_ import InputPlugin

from pygame_midi_wrapper import PygameMidiDeviceHelper


class MidiInputPlugin(InputPlugin):

    def __init__(self, event_handler, options):
        super().__init__('midi', event_handler)
        self.midi_port_name = options.get('midi_port_name')

    def open(self):
        pygame.init()
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
                    import pdb ; pdb.set_trace()
                    self.event_handler(e)

            if self.midi_input.poll():
                for midi_event in pygame.midi.midis2events(self.midi_input.read(10), self.midi_input.device_id):
                    self.event_post(midi_event)

        self.close()

    def close(self):
        del self.midi_input
        pygame.midi.quit()

