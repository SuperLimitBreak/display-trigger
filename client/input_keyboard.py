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
            event = pygame.event.wait()
            if event.type == pygame.QUIT or (event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE):
                running = False
            if event.type == pygame.KEYDOWN:
                self.event_handler(event.unicode)

        self.close()

    def close(self):
        pygame.quit()
