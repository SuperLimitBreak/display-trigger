#download python
$url = "https://www.python.org/ftp/python/3.1.4/python-3.1.4.msi"
$out = "C:\Users\Music\Desktop\python.msi"
(New-Object System.Net.WebClient).DownloadFile($url, $out)

#Install python
$phony = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $out /passive /qn" -Wait -Passthru
If($?) {
	echo "Python Installed"
} Else {
	echo "Please manualy install python"
}

#download pygame
$url = "http://pygame.org/ftp/pygame-1.9.1.win32-py3.1.msi"
$out = "C:\Users\Music\Desktop\pygame.msi"
(New-Object System.Net.WebClient).DownloadFile($url, $out)

#Install pygame
$phony = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $out /passive /qn" -Wait -Passthru
If($?) {
	echo "Pygame Installed"
} Else {
	echo "Please manualy install pygame"
}
