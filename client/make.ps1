param ( [Switch] $install = $false, [Switch] $run = $false )

# set-executionpolicy -unrestricted
# http://superuser.com/questions/25538/how-to-download-files-from-command-line-in-windows-like-wget-is-doing

# TODO: create ./libs/ folder

if ($install -eq $true ) {
	#This method only works in powershell v3+
    #Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/network_display_event.py" -OutFile "network_display_event.py"
    #Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/pygame_midi_wrapper.py"   -OutFile "pygame_midi_wrapper.py"
    #Invoke-WebRequest "https://raw.githubusercontent.com/calaldees/PentatonicHero/master/music.py"	-OutFile "music.py"
	
	#Powershell v1+ support
	$client = new-object System.Net.WebClient 
    $client.DownloadFile("https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/network_display_event.py", "libs/network_display_event.py")
	$client.DownloadFile("https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/pygame_midi_wrapper.py", "libs/pygame_midi_wrapper.py")
	$client.DownloadFile("https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/pygame_midi_input.py", "libs/pygame_midi_input.py")
	$client.DownloadFile("https://raw.githubusercontent.com/calaldees/libs/master/python3/lib/midi/music.py", "libs/music.py")
}

if ($run -eq $true) {
    python3 displaytrigger.py --input midi
}
