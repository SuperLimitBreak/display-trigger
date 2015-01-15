from input_ import InputPlugin


class ConsoleInputPlugin(InputPlugin):
    def __init__(self, event_handler, options):
        super().__init__('console', event_handler)

    def open(self):
        print('Event Console')
        self.run()

    def run(self):
        try:
            while True:
                self.event_handler(input('> '))
        except KeyboardInterrupt:
            pass

        self.close()

    def close(self):
        print()
