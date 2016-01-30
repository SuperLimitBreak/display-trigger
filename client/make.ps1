param ( [Switch] $install = $false, [Switch] $run = $false )

# set-executionpolicy -unrestricted
# http://superuser.com/questions/25538/how-to-download-files-from-command-line-in-windows-like-wget-is-doing

if ($install -eq $true ) {
    #This method only works in powershell v3+
    #Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/network_display_event.py" -OutFile "network_display_event.py"
    #Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/pygame_midi_wrapper.py"   -OutFile "pygame_midi_wrapper.py"
    #Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/music.py"	-OutFile "music.py"
	
    #Powershell v1+ support
    mkdir libs
    echo $null >> "$(pwd)\libs\__init__.py"
    $url = "https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/net/client_reconnect.py"
    $out = "$(pwd)\libs\client_reocnnect.py"
    (New-Object System.Net.WebClient).DownloadFile($url, $out)

    $url = "https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/pygame_midi_wrapper.py"
    $out = "$(pwd)\libs\pygame_midi_wrapper.py"
    (New-Object System.Net.WebClient).DownloadFile($url, $out)
    

    $url = "https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/pygame_midi_input.py"
    $out = "$(pwd)\libs\pygame_midi_input.py"
    (New-Object System.Net.WebClient).DownloadFile($url, $out)
    
    $url = "https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/music.py"
    $out = "$(pwd)\libs\music.py"
    (New-Object System.Net.WebClient).DownloadFile($url, $out)
}

if ($run -eq $true) {
    python3 displaytrigger.py --input midi
}
