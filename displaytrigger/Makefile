OS = $(shell uname -s)

PROJECT=displaytrigger

INI_DEV  = development.ini
INI_TEST = test.ini
INI_PROD = production.ini


help:
	# Usage: make <target>, where target is
	# install        -- run after clean checkout to pull dependecys and setup
	#
	# Typical first use should be: run


# Installation -----------------------------------------------------------------

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

env: .installed_python
	# Reference - http://docs.pylonsproject.org/projects/pyramid/en/1.5-branch/narr/install.html
	virtualenv --no-site-packages -p python3 env
	env/bin/easy_install pyramid

$(PROJECT).egg-info: env
	env/bin/python setup.py develop

dependency_downloader.py:
	curl https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/dependency_downloader.py --compressed -O

externals:
	mkdir externals && touch externals/__init__.py

dependency_download: dependency_downloader.py externals
	env/bin/python dependency_downloader.py --destination externals

install: development.ini production.inidiff $(PROJECT).egg-info dependency_download


# Ini files --------------------------------------------------------------------

development.ini:
	cp development.ini.dist development.ini

production.inidiff:
	cp production.inidiff.dist production.inidiff

ini_test: development.ini
	env/bin/python3 externals/lib/make_ini.py test
ini_production: production.inidiff
	env/bin/python3 externals/lib/make_ini.py production

run: install
	env/bin/pserve --reload $(INI_DEV)

run_production: ini_production
	env/bin/pserve $(INI_PROD)

shell:
	env/bin/pshell $(INI_DEV)

# Cleanup ----------------------------------------------------------------------

clean:
	rm -rf *.pyc
	rm -rf .installed_*
	rm -rf env
	rm -rf *.egg-info
	rm -f *.log
	rm -f $(INI_DEV)
	rm -f $(INI_TEST)
	rm -f $(INI_PROD)
	rm -rf externals
	rm -rf dependency_downloader.py
	rm -rf dependencys_installed.json
