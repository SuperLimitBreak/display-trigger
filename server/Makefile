OS = $(shell uname -s)

PROJECT=displaytrigger

ENV:=_env
PYTHON:=$(ENV)/bin/python3
PIP:=$(ENV)/bin/pip3
PSERVE:=$(ENV)/bin/pserve
PSHELL:=$(ENV)/bin/pshell
PYTEST:=$(ENV)/bin/py.test


INI_DEV  = development.ini
INI_TEST = test.ini
INI_PROD = production.ini


.PHONY: help
help:
	# Usage: make <target>, where target is
	#   - install        -- run after clean checkout to pull dependecys and setup
	#   - run            -- run development setup (depends on install)
	#   - run_production --
	#   - clean          -- Remove all generated files and return to base checkout
	#
	# Typical first use should be: run


# Installation -----------------------------------------------------------------

.PHONY: install
install: development.ini production.inidiff $(PROJECT).egg-info dependencys_installed.json externals/static/pentatonic_hero_visulisation.js externals/static/webMidiMultiplexer.html externals/static/websocket.js
	#externals/static/lightingRemoteControl.html


# Dependencys ------------------------------------------------------------------

# DEPRICATED
# TODO: Installing system levels dependencys should not be the role of this Makefile
.installed_python: .installed_python_$(OS)
	touch .installed_python
# OSX installation
.installed_python_Darwin:
	brew install python3
	# python virtualenv?
	touch .installed_python_Darwin
# Linux installation
.installed_python_Linux:
	if dpkg -s python-virtualenv ; then \
		echo virtualenv already installed; \
	else \
		echo installing virtualenv; \
		sudo apt-get install -y python-virtualenv curl ; \
	fi
	if dpkg -s python3-setuptools ; then \
		echo python 3 already installed; \
	else \
		echo installing python 3; \
		sudo apt-get install -y python3-setuptools python3-dev curl ; \
	fi
	touch .installed_python_Linux

.PHONY: has-python
has-python:
	which python
	which python3
	which virtualenv

.PRECIOUS: $(ENV)
$(ENV):
	# Reference - http://docs.pylonsproject.org/projects/pyramid/en/1.5-branch/narr/install.html
	# system-site-packages used as we require python3-dbus, this isn't can't be installed from venvs!
	# 	hope to remove this!
	virtualenv --system-site-packages -p python3 $@
	$(PIP) install --upgrade pip setuptools
	$(ENV)/bin/easy_install pyramid

.PRECIOUS: $(PROJECT).egg-info
$(PROJECT).egg-info: $(ENV)
	$(PYTHON) setup.py develop

externals:
	mkdir externals && touch externals/__init__.py

externals/static/pentatonic_hero_visulisation.js:
	mkdir -p externals/static/
	cd externals/static/ && \
	if [ -d ../../../../pentatonicHero/ ] ; then \
		ln -s ../../../../pentatonicHero/pentatonic_hero_visulisation.js        pentatonic_hero_visulisation.js  ;\
		ln -s ../../../../pentatonicHero/pentatonic_hero_visulisation.css       pentatonic_hero_visulisation.css ;\
	else \
		curl https://raw.githubusercontent.com/calaldees/pentatonicHero/master/pentatonic_hero_visulisation.js  --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/pentatonicHero/master/pentatonic_hero_visulisation.css --compressed -O ;\
	fi

externals/static/websocket.js:
	mkdir -p externals/static/
	cd externals/static/ && \
	if [ -d ../../../../libs/ ] ; then \
		ln -s ../../../../libs/js/websocket.js        websocket.js  ;\
		ln -s ../../../../libs/js/music.js            music.js ;\
		ln -s ../../../../libs/js/utils.js            utils.js ;\
	else \
		curl https://raw.githubusercontent.com/calaldees/libs/master/js/websocket.js  --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/libs/master/js/music.js      --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/libs/master/js/utils.js      --compressed -O ;\
	fi

#externals/static/lightingRemoteControl.html:
#	mkdir -p externals/static/
#	cd externals/static/ && \
#	if [ -d ../../../../stageOrchestration/ ] ; then \
#		ln -s ../../../../stageOrchestration/webRemoteControl.html              lightingRemoteControl.html ;\
#	else \
#		echo "webRemoteControl.html not linked" > lightingRemoteControl.html ;\
#	fi

externals/static/webMidiMultiplexer.html:
	mkdir -p externals/static/
	cd externals/static/ && \
	if [ -d ../../../../webMidiTools/ ] ; then \
		ln -s ../../../../webMidiTools/webMidiMultiplexer.html              webMidiMultiplexer.html ;\
	else \
		echo "webMidiMultiplexer.html not linked" > webMidiMultiplexer.html ;\
	fi

dependencys_installed.json: libs externals
	$(PYTHON) libs/dependency_downloader.py --destination externals

libs:
	mkdir libs
	touch libs/__init__.py
	cd libs && \
	if [ -d ../../../libs/ ] ; then \
		ln -s ../../../libs/python3/lib/dependency_downloader.py           dependency_downloader.py ;\
		ln -s ../../../libs/python3/lib/misc.py                            misc.py                  ;\
		ln -s ../../../libs/python3/lib/make_ini.py                        make_ini.py              ;\
		ln -s ../../../libs/python3/lib/multisocket/multisocket_server.py  multisocket_server.py    ;\
		ln -s ../../../libs/python3/lib/multisocket/subscription_server.py subscription_server.py   ;\
	else \
		curl https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/dependency_downloader.py           --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/misc.py                            --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/make_ini.py                        --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/multisocket/multisocket_server.py  --compressed -O ;\
		curl https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/multisocket/subscription_server.py --compressed -O ;\
	fi


# Ini files --------------------------------------------------------------------

development.ini:
	cp development.ini.dist development.ini

production.inidiff:
	cp production.inidiff.dist production.inidiff

ini_test: development.ini libs
	$(PYTHON) libs/make_ini.py $(INI_DEV) test.inidiff $(INI_TEST)
ini_production: production.inidiff libs
	$(PYTHON) libs/make_ini.py $(INI_DEV) production.inidiff $(INI_PROD)


# Run --------------------------------------------------------------------------

run: install
	$(PSERVE) --reload $(INI_DEV)

run_production: ini_production
	$(PSERVE) $(INI_PROD)

shell:
	$(PSHELL) $(INI_DEV)

# Cleanup ----------------------------------------------------------------------

.PHONY: clean
clean:
	rm -rf *.pyc
	rm -rf .installed_*
	rm -rf $(ENV)
	rm -rf *.egg-info
	rm -f *.log
	rm -f $(INI_DEV)
	rm -f $(INI_TEST)
	rm -f $(INI_PROD)
	rm -rf externals
	rm -rf libs
	rm -rf dependencys_installed.json
