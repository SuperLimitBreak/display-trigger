include .env

help:
	# todo


# Install ----------------------------------------------------------------------

node_modules:
	npm install

.PHONY: install
install: node_modules
	# todo


# Run --------------------------------------------------------------------------

run: install
	#webpack --progress --colors --watch
	npm run start


# Test -------------------------------------------------------------------------

test: install
	npm run validate


# Utils -------------------------------------------------------------------------

screen_size:
	# Temp hack for projector setup
	curl -XGET http://localhost:6543/event/screen_size.set -d '{"deviceid": "main", "top":"100px", "left":"100px", "width": "400px", "height":"300px", "border": "1px dashed green"}'


# Clean ------------------------------------------------------------------------

clean:
	rm -rf dist/
	rm -rf node_modules/
	rm -rf *.log
