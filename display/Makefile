include .env

help:
	# todo


# Install ----------------------------------------------------------------------

#node_modules/gsap/src/uncompressed/plugins/SplitTextPlugin.js: node_modules
#    curl https://raw.githubusercontent.com/netgfx/SplitText/master/js/SplitTextPlugin.js -o $@

node_modules:
	npm install
node_modules/calaldees_libs:
	npm link ../../libs
node_modules/multisocketServer:
	npm link ../../multisocketServer

.PHONY: install
install: node_modules node_modules/calaldees_libs node_modules/multisocketServer
    # node_modules/gsap/src/uncompressed/plugins/SplitTextPlugin.js
	# todo


# Run --------------------------------------------------------------------------

run: install
	#webpack --progress --colors --watch
	npm run start

build: install
	npm run build


# Test -------------------------------------------------------------------------

test: install
	npm run test


# Utils -------------------------------------------------------------------------

screen_size:
	# Temp hack for projector setup
	curl -XGET http://localhost:6543/event/screen_size.set -d '{"deviceid": "main", "top":"100px", "left":"100px", "width": "400px", "height":"300px", "border": "1px dashed green"}'


# Clean ------------------------------------------------------------------------

clean:
	rm -rf static/
	rm -rf node_modules/
	rm -rf *.log
