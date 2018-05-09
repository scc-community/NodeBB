'use strict';

var qr = require('qr-image');
var topics = require('../topics');

module.exports = function (app, middleware, controllers) {
	app.get('/sitemap.xml', controllers.sitemap.render);
	app.get('/sitemap/pages.xml', controllers.sitemap.getPages);
	app.get('/sitemap/categories.xml', controllers.sitemap.getCategories);
	app.get(/\/sitemap\/topics\.(\d+)\.xml/, controllers.sitemap.getTopicPage);
	app.get('/robots.txt', controllers.robots);
	app.get('/manifest.json', controllers.manifest);
	app.get('/css/previews/:theme', controllers.admin.themes.get);
	app.get('/osd.xml', controllers.osd.handle);

	app.get('/create_qrcode', function (req, res) {
		var text = req.query.text;
		try {
			var img = qr.image(text, { size: 4 });
			res.writeHead(200, { 'Content-Type': 'image/png' });
			img.pipe(res);
		} catch (e) {
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.end('<h1>' + e + '</h1>');
		}
	});

	app.get('/test', function (req, res) {
		topics.buildTopicsReward();
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end('<h1>' + 'hello' + '</h1>');
	});
};
