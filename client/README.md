Windows Installation
--------------------
#Install Process
1. Install python 3.1.x (at this time only x86 is supported by pygame and the port midi for 3.2 is broken in pygame)
2. Install python pygame for 3.1
3. Select python 3.1 from registry during pygame install

##Using dependancy script
`powershell -noexit -executionpolicy unrestricted -command C:\Users\[user]\Desktop\dependancies.ps1`

#Editing path (Windows 7 & Vista)
1. Click start
2. Right-Click "Computer"
3. Select "Properties"
4. Click "Advanced System settings"
5. Under the "Hardware" tap click the "Environment Variables" button
6. Under "System Variables" select the "Path" field
7. Click Edit
8. Append ";C:\Python31" (or your python 3.1 install location) to the "Variable Value" field.
9. Press "OK"
