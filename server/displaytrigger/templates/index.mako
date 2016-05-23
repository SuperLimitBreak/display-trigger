<!DOCTYPE html>
<html lang="${request.locale_name}">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="pyramid web application">

		<link rel="shortcut icon" href="${request.static_url('displaytrigger:static/pyramid-16x16.png')}">

		<title>${project}</title>

		<link href="/ext/cssreset-min.css" rel="stylesheet">
	</head>
	
	<body>
		<h1>${project}</h1>
		<ul>
			<li><a href="/display/display.html">display</a>
			<li><a href="/display/display.html?deviceid=main">display?deviceid=main</a>
			<li><a href="/display/display.html?deviceid=test">display?deviceid=test</a>
			<li><a href="/display/display.html?deviceid=subtitles">display?deviceid=subtitles</a>
			<li><a href="/trigger/trigger.html">triggerWeb</a>
			<li><a href="/ext/lightingRemoteControl.html">lightingRemoteControl</a></li>
			<li><a href="/ext/webMidiMultiplexer.html">webMidiMultiplexer</a></li>
		</ul>
	</body>
</html>
