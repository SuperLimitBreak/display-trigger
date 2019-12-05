PATH_DISPLAY:=../display
PATH_CALALDEES_LIBS:=../../libs
PATH_MULTISOCKET_SERVER:=../../multisocketServer


# Run --------------------------------------------------------------------------
.PHONY: build run test

build: install
	npm run build

run: install
	npm run start

test: install
	npm run test

# Install ----------------------------------------------------------------------

.babelrc:
	cp ${PATH_DISPLAY}/$@ ./
.editorconfig:
	cp ${PATH_DISPLAY}/$@ ./
.eslintrc:
	cp ${PATH_DISPLAY}/$@ ./
webpack.config.base.js:
	cp ${PATH_DISPLAY}/$@ ./
node_modules: .babelrc .editorconfig .eslintrc webpack.config.base.js
	npm install
node_modules/calaldees_libs:
	npm link ${PATH_CALALDEES_LIBS}
node_modules/multisocketServer:
	npm link ${PATH_MULTISOCKET_SERVER}

.PHONY: install
install: node_modules node_modules/calaldees_libs node_modules/multisocketServer

# Clean ------------------------------------------------------------------------

clean:
	rm -rf static/
	rm -rf node_modules/
	rm -rf *.log
