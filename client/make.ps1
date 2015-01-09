param ( [Switch] $install = $false, [Switch] $run = $false )

# set-executionpolicy -unrestricted
# http://superuser.com/questions/25538/how-to-download-files-from-command-line-in-windows-like-wget-is-doing

if ($install -eq $true ) {
    Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/network_display_event.py" -OutFile "network_display_event.py"
    Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/pygame_midi_wrapper.py"   -OutFile "pygame_midi_wrapper.py"
    Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/music.py"                 -OutFile "music.py"
}

if ($run -eq $true) {
    python3 displaytrigger.py --input midi
}
