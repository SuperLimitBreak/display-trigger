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
			<li><a href="/static/projector/projector.html">Projector</a>
			<li><a href="/static/control/control.html">Control</a>
			<li><a href="/ext/lightingRemoteControl.html">lightingRemoteControl</a></li>
		</ul>
	</body>
</html>
