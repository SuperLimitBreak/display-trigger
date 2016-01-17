OS = $(shell uname -s)

help:
	# -- Display Trigger Client --
	# install : Install
	# run     : Run
	# test    : test
	# clean	  : clean local libs


# Installation -----------------------------------------------------------------

.Phony: install
install: $(OS) libs

# OSX installation
.Phony: Darwin
Darwin:
	brew install python3 sdl sdl_image sdl_mixer sdl_ttf portmidi mercurial
	pip3 install hg+http://bitbucket.org/pygame/pygame

# Linux installation
.Phony: Linux
Linux: pygame
	sudo apt-get install -y python3 mercurial python3-dev python3-pip python3-numpy libsdl-image1.2-dev libsdl-mixer1.2-dev libsdl-ttf2.0-dev libsmpeg-dev libsdl1.2-dev  libportmidi-dev libswscale-dev libavformat-dev libavcodec-dev libfreetype6-dev

.Phony: pygame
pygame:
	# There is no python3-pygame package - The Pygame wiki suggests compileing it yourself.
	# http://www.pygame.org/wiki/CompileUbuntu

	if [ $$(pip3 list | grep -c pygame) -eq 0 ];\
	then\
		echo "Installing pygame";\
		sudo pip3 install hg+http://bitbucket.org/pygame/pygame;\
	fi

libs:
	mkdir libs
	touch libs/__init__.py

	# Link to files in "lib" repo in the folder above the displayTrigger repo
	# If the don't exist gather the correct files
	cd libs && \
	base_libs='../../../libs';\
	if [ -d $$base_libs ] ; then \
	    echo "Libs found, linking";\
		ln -sf $$base_libs/python3/lib/net/client_reconnect.py client_reconnect.py ;\
		ln -sf $$base_libs/python3/lib/midi/pygame_midi_wrapper.py pygame_midi_wrapper.py ;\
		ln -sf $$base_libs/python3/lib/midi/pygame_midi_input.py pygame_midi_input.py ;\
		ln -sf $$base_libs/python3/lib/midi/music.py music.py ;\
	else \
	    echo "Libs not found, retreiving";\
		wget https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/net/client_reconnect.py -c 2>/dev/null;\
		wget https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/pygame_midi_wrapper.py -c 2>/dev/null;\
		wget https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/pygame_midi_input.py -c 2>/dev/null;\
		wget https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/music.py -c 2>/dev/null;\
	fi


# Run --------------------------------------------------------------------------
run:
	python3 displaytrigger.py

test:
	python3 -m doctest -v *.py

clean:
	rm -rf libs
