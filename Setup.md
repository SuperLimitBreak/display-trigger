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
* `sudo apt-get update && apt-get install chromium -y`
* `echo "@/boot/pi_boot.sh" >> /etc/xdg/lxsession/LXDE-pi/autostart`
* todo - rem the following line in autostart `@xscreensaver -no-splash`


`sudo nano /boot/pi_boot.sh && sudo chmod 755 /boot/pi_boot.sh`


	xset s noblank
	xset s off
	xset -dpms
	rm -rf ~/.cache/chromium ~/.config/chromium
	while ! ip -f inet addr show dev wlan0 | sed -n 's/^ *inet *\([.0-9]*\).*/\1/p' | grep "" > /dev/null
	do
  	  sleep 1
	done
	chromium --noerrdialogs --ignore-certificate-errors --kiosk --disable-plugins --disable-extensions --no-first-run --disable-overlay-scrollbar 'http://192.168.0.3:6543/static/projector/projector.html'
	
* `sudo reboot`


