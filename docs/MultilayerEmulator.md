MultiLayer Emulator
===================

This document contains wip development notes about achiving MutliLayer Retrogame Emulator for a live music performance.


Live Music Concept
------------------

* Have two instances of 'networked' emulators. There are systems for providing each instance with the same inputs for the same frames, thusly keeping both instances in sync.
* Each instance will have differnt layers disabled.
    * Instance 1 will have just the forground objects e.g. just the fighting game characters and health bars. This will be projected onto the holographic screen.
    * Instance 2 will have just the background layers enabled and be projected on a screen behind the band.
* The audience will play the game live while the band are effectivly performing in the middle of the retrogame scene.
* The could potentially be done with shooters or '1 on 1' fighting games

Requirements
------------

* We need a way of taking the output from 2 offscreen windows and displaying the contents within a html5 webbrowser that can be triggered on/off with our existing trigger system.
* The emulator instances will need to be automated in startup and savestate/restore (possibly to get directly to the character select screen). 
    * This may entail sending automated keypress's to toggle the relevent layers on/off.
* The sound output from the emulator will also need thought. It would be ideal to disable the music chip but still have the sound effects.
    * Sound is secondary to the visuals but still should be considered.


Current Investigation Notes
---------------------------

We need to serve the output from the emulators to html5. We could:

* Use a virtual webcam and render to the virtual webcam
    * Additional kernal modules and currently have yet to achive a working demo
* Use the upcoming html5 deviceCapture
    * Security constrains means there must be user interation to select the window required to capture
    * Currently constraints are not implemented so it's only 30fps
    * Requires a plugin to enable displayCapture devices


Emulator Constraints
--------------------

We require some special features of the emulators running these games.

* Mame
    * Mame supports karellia for networking. Other networking engines are old and poorly supported.
    * Mame can not toggle layers or sound chips.
    * Kareallia Networking is
        * Is a windows only server
        * Is not a perfect/infalable network and can get out of sync (should not be a problem on our loopback interface)
        * Is not open source.

* WinKawacks
    * Can toggle visual layers and sound chips
    * Sadly Windows only
        * As it's windows, is not automatable or easily integratable with our existinging server. (However virtulisation may be possible, but this feels like more cogs for potential failiure).
    * Kareallia networking is the only network option and requires special derivative builds.

* Mednafen
    * Cross platform & open source
    * Has it's own open source networking system
    * Only emulates home consoles (not arcade machines)
    * Supports layer toggling with hotkeys
        * The Megadrive supports layer toggling. 
        * The SNES engine does not support layer toggling.
    * No sound chip toggling


WebRTC DisplayCapture
---------------------

We have achived Mednafen with Chrome.
Megadrive Street Fighter 2. At 30fps. Will have to mute all sound. Key automation will have to be setup to toggle the layers after emulator start.

https://github.com/muaz-khan/Chrome-Extensions
https://webrtc.github.io/samples/src/content/capture/canvas-video/


Virtual Webcam
--------------

We already have some experimental support for using webcam feeds used in html5 docuemnts with our trigger system. Displaying a _Virtual Webcam_ could be a clean solution.

http://superuser.com/questions/411897/using-desktop-as-fake-webcam-on-linux

    # install the virtual-webcam driver, creates /dev/video0 device
    modprobe v4l2loopback
    # read from x11, write into virtual webcam
    ffmpeg -f x11grab -r 15 -i :1.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0

Help
----

Any assistance with achiving this concept would be greatly appreciated.

