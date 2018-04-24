'use strict';

var fs = require('fs');
var path = require('path');

var config = require('./default');
var cache = require('./cache');
var MIME = require('./mime.json');
var urlHandle = require('./urlHandle');

var helpers = require('../../controllers/helpers');

module.exports = function (req, res, next) {
	// 取得绝对路径
	config.base = path.resolve(path.resolve('./'));
	config.cache_path = path.resolve(config.base, config.cache_path);

	if (!req.url) {
		return helpers.noScriptErrors(req, res, '{code:-1, result: "url is undefine")', 400);
	}

	if (config.cache) {
		if (cache.check(req.url, config, res) === true) {
			return next();
		}
	}

	var result = '';
	var url_data;
	var webserver = require('../../webserver');
	console.log(webserver.app.statics);
	url_data = urlHandle(req, config);
	url_data.urls.forEach(function (value) {
		if (fs.existsSync(value.path)) {
			result += require('./load/' + value.parse)(value);
		}
	});

	if (result === '') {
		helpers.noScriptErrors(req, res, '{code:-1, result: "result is empty")', 400);
	} else {
		result = '/** mergeRes */\n' + result;
		if (config.cache) {
			cache.write(req.url, result, url_data.type, MIME[url_data.type], config);
		}
		req.headers['Content-Type'] = MIME[url_data.type];
		res.status(200).send(result);
		// res.writeHead(200, { 'Content-Type': MIME[url_data.type] });
		// res.end(result);
	}
};
