import pygame
import pygame.midi

from input_ import InputPlugin


class MidiInputPlugin(InputPlugin):
    def __init__(self, event_handler):
        super().__init__('midi', event_handler)

    def open(self):
        pygame.init()
        pygame.event.set_blocked(pygame.MOUSEMOTION)
        pygame.fastevent.init()
        self.event_get = pygame.fastevent.get
        self.event_post = pygame.fastevent.post

        pygame.midi.init()
        input_id = pygame.midi.get_default_input_id()
        self.midi_input = pygame.midi.Input(input_id)

        pygame.display.set_mode((1, 1))

        self.run()

    def run(self):
        going = True
        while going:
            events = self.event_get()
            for e in events:
                if e.type in [pygame.QUIT, pygame.KEYDOWN]:
                    going = False
                if e.type in [pygame.midi.MIDIIN]:
                    self.event_handler(e)

            if self.midi_input.poll():
                for midi_event in pygame.midi.midis2events(self.midi_input.read(10), self.midi_input.device_id):
                    self.event_post(midi_event)

        self.close()

    def close(self):
        del self.midi_input
        pygame.midi.quit()

