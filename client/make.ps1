param ( [Switch] $install = $false, [Switch] $run = $false )

# set-executionpolicy -unrestricted

if ($install -eq $true ) {
    Invoke-WebRequest "http://" -OutFile "test.txt"
}

if ($run -eq $true) {
    python3 displaytrigger.py
}
