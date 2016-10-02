/**
 * Created by tal on 10/2/16.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
	const FILE = './index.html';

	res.statusCode = 200;
	// res.sendFile();
	// res.write("Working");

	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			"Content-Type": "text/html",
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile(FILE, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:', FILE);
			res.end();
		}
	});
});

app.get('/logo.png', function(req, res) {

	const FILE = path.join(__dirname + "/logo.png");

	res.statusCode = 200;

	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			"Content-Type": "image/png",
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile(FILE, options, function (err) {
		if (err) {
			console.log("An error occurred while attempting to serve " + FILE);
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:' + FILE);
			res.end();
		}
	});
});

app.get('/images/*', function (req, res) {
	allowServeFromDir(req, res, 'jpg');
});

app.get('/js/*', function (req, res) {
	allowServeFromDir(req, res, 'js');
});

app.get('/css/*', function (req, res) {
	allowServeFromDir(req, res, 'css');
});

app.get('/fonts/*', function (req, res) {
	allowServeFromDir(req, res, 'font');
});

app.get('/trafficRisk_files/*', function (req, res) {
	allowServeFromDir(req, res, 'js');
});

app.get('/dataPredict/trafficRisk.html', function(req, res) {
	allowServeFromDir(req, res, 'html');     // HTML is not an expected value here, but the variable is html by default
});

app.listen(PORT, function () {
	console.log('Example app listening on port ' + PORT + '!');
});

function allowServeFromDir(req, res, type) {
	var headerMIME = "image/html";     // This is a dangerous case, as it leaves html default
	if (type == 'jpg') {
		headerMIME = "image/jpeg";
	} else if (type == 'js') {
		headerMIME = "application/javascript";
	} else if (type == 'css') {
		headerMIME = "text/css";
	} else if (type == 'font') {
		headerMIME = "application/font-woff";
	}

	const FILE = req.url;

	res.statusCode = 200;

	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			"Content-Type": headerMIME,
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile(FILE, options, function (err) {
		if (err) {
			console.log("An error occurred while attempting to serve " + FILE);
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:' + FILE);
			res.end();
		}
	});
}

function doIfFile(file, cb) {
	fs.stat(file, function fsStat(err, stats) {
		if (err) {
			if (err.code === 'ENOENT') {
				return cb(null, false);
			} else {
				return cb(err);
			}
		}
		return cb(null, stats.isFile());
	});
}
