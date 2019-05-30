PATH_LIB_ES6:=../../libs/es6
PATH_LIB_MULTISOCKET_CLIENT:=../../multisocketServer/clients/js
PATH_BUILD:=static

install: ${PATH_BUILD} ${PATH_BUILD}/index.html ${PATH_BUILD}/music.js ${PATH_BUILD}/websocket.js

${PATH_BUILD}:
	mkdir $@

${PATH_BUILD}/index.html:
	cp src/trigger.html $@

${PATH_BUILD}/music.js:
	cp ${PATH_LIB_ES6}/core.js ${PATH_BUILD}/core.js
	cp ${PATH_LIB_ES6}/web.js ${PATH_BUILD}/web.js
	cp ${PATH_LIB_ES6}/music.js $@

${PATH_BUILD}/websocket.js:
	cp ${PATH_LIB_MULTISOCKET_CLIENT}/websocket.js $@

clean:
	rm -rf ${PATH_BUILD}
