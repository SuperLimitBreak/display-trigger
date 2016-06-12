URL_LIBS:=https://raw.githubusercontent.com/calaldees/libs/master
LIBS_PATH:=../../libs

.PHONY: help
help:
	#

.PHONY: install
install:  build/libs/utils.js build/libs/websocket.js build/libs/music.js
	#build/ext/underscore-min.js build/ext/jquery.min.js build/ext/cssreset-min.css

build/ext:
	mkdir $@
build/libs:
	mkdir $@
build/ext/underscore-min.js: build/ext
	curl https://raw.github.com/jashkenas/underscore/1.8.3/underscore-min.js --compressed -o $@
build/ext/jquery.min.js: build/ext
	curl http://code.jquery.com/jquery-2.1.4.min.js --compressed -o $@
build/ext/cssreset-min.css:
	curl http://yui.yahooapis.com/3.18.1/build/cssreset/cssreset-min.css --compressed -o $@
build/libs/%: build/libs
	if [ -d $(LIBS_PATH) ] ; then \
		ln -s ../../$(LIBS_PATH)/js/$% $@ ;\
	else \
		curl $(URL_LIBS)/js/$% --compressed -o $@ ;\
	fi

.PHONY: clean
clean:
	rm -rf build/libs build/ext
