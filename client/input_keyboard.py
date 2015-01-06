import pygame

from input_ import InputPlugin


class KeyboardInputPlugin(InputPlugin):
    def __init__(self, event_handler):
        super().__init__('keyboard', event_handler)

    def open(self):
        pygame.init()
        pygame.event.set_blocked(pygame.MOUSEMOTION)
        self.run()

    def run(self):
        running = True
        while running:
            e = pygame.event.wait()
            if e.type in [pygame.QUIT, pygame.KEYDOWN]:
                running = False
        self.close()

    def close(self):
        pygame.quit()
