
install: network_display_event.py pygame_midi_wrapper.py music.py

network_display_event.py:
	curl https://raw.githubusercontent.com/calaldees/PentatonicHero/master/network_display_event.py --compressed -O
pygame_midi_wrapper.py:
	curl https://raw.githubusercontent.com/calaldees/PentatonicHero/master/pygame_midi_wrapper.py --compressed -O
music.py:
	curl https://raw.githubusercontent.com/calaldees/PentatonicHero/master/music.py --compressed -O

test: install
	python3 -m doctest -v *.py

run: install
	python3 displaytrigger.py
