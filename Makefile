ENV:=_env

.PHONEY: help
help:
	#

.PHONEY:
install:
	$(MAKE) install --directory server/

.PHONEY: test
test:
	#

.PHONY: cloc
cloc:
	cloc --vcs=git

.PHONEY: clean
clean:
	#
