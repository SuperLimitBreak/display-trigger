Setup
=====

Server Setup
------------

* Use router to assign constant ip
* todo

Projector Setup
---------------

todo

Raspberry Pi Setup
------------------

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
	    chromium --noerrdialogs --ignore-certificate-errors --kiosk --disable-plugins --disable-extensions --no-first-run --disable-overlay-scrollbar 'http://192.168.0.3:6543/static/projector/projector.html?deviceid=pi_prompt'
    EOF
	chmod 755 /boot/pi_boot.sh
	sed -i 's/@xscreensaver -no-splash/#@xscreensaver -no-splash/' /etc/xdg/lxsession/LXDE-pi/autostart
	echo "@/boot/pi_boot.sh" >> /etc/xdg/lxsession/LXDE-pi/autostart
	reboot

