#download python
$url = "https://www.python.org/ftp/python/3.1.4/python-3.1.4.msi"
$out = "C:\Users\IEUser\Desktop\python.msi"
(New-Object System.Net.WebClient).DownloadFile($url, $out)

#Install python
(Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $out /passive /qn" -Wait -Passthru).ExitCode
If($?) {
	echo "Python Installed"
} Else {
	echo "Please manualy install python"
}

#Download pygame
