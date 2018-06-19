Setup
=====

Setting up a full displayTrigger system requires understanding of core components.
Below are notes to guide users in their first test setup

`server` setup
--------------

* setup absolute asset path in development.ini
    * _details required_


### Local use


`triggerWeb` setup
------------------

`display` setup
---------------

`eventMap` setup
----------------


`display` on Raspberry Pi
-------------------------

Subtitle prompt screen driven by raspberry pi

* Download/Install Noobs
* In conf enable 
  * Boot to gui with user pi
  * Enable ssh
* Connect wireless to required network
* Open up terminal and obtain ip address `ip -f inet addr show dev wlan0`
* `ssh` into the pi (`ssh pi@1.1.1.1`) (password: raspberry) and paste the script below into a terminal

'

	sudo -s
	apt-get update && apt-get install chromium -y
	cat <<EOF > /boot/pi_boot.sh
	#!/bin/sh
	    INTERFACE=wlan0
	    IPLIST=ifconfig $(INTERFACE) | awk '/inet addr/{print substr($2,6)}'
	    xset s noblank
	    xset s off
	    xset -dpms
	    rm -rf ~/.cache/chromium ~/.config/chromium
	    while ! $(IPLIST) | grep "" > /dev/null
	    do
  	        sleep 1
	    done
	    chromium --noerrdialogs --ignore-certificate-errors --kiosk --disable-plugins --disable-extensions --no-first-run --disable-overlay-scrollbar 'http://192.168.0.3:6543/display/display.html?deviceid=pi_prompt'
    EOF
	chmod 755 /boot/pi_boot.sh
	sed -i 's/@xscreensaver -no-splash/#@xscreensaver -no-splash/' /etc/xdg/lxsession/LXDE-pi/autostart
	echo "@/boot/pi_boot.sh" >> /etc/xdg/lxsession/LXDE-pi/autostart
	reboot

Some css3 effects (like transparency) are poorly optimised in the default browser on the pi.


stageOrchestration
------------------

There are other projects that can hook into displayTrigger triggers.
[stageOrchestration](https://github.com/SuperLimitBreak/stageOrchestration) is a python dmx control system that can be triggered.


systemSetup
-----------

[systemSetup](https://github.com/SuperLimitBreak/systemSetup) is a `Makefile` that pulls the entire suite [SuperLimitBreak.uk](http://superlimitbreak.uk) tech stack repos and link the shared librarys together.
