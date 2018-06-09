'use strict';

var helpers = require('./helpers');
var setupPageRoute = helpers.setupPageRoute;

module.exports = function (app, middleware, controllers) {
	var middlewares = [middleware.checkGlobalPrivacySettings];

	setupPageRoute(app, '/task/center', middleware, middlewares, controllers.tasks.center.get);
	setupPageRoute(app, '/task/mytask', middleware, middlewares, controllers.tasks.center.getMyTask);
	setupPageRoute(app, '/task/center/detail', middleware, middlewares, controllers.tasks.center.getDetail);
	setupPageRoute(app, '/task/project', middleware, middlewares, controllers.tasks.project.get);
	setupPageRoute(app, '/task/project/detail', middleware, middlewares, controllers.tasks.project.getDetail);
	setupPageRoute(app, '/task/module', middleware, middlewares, controllers.tasks.module.get);
	setupPageRoute(app, '/task/module/detail', middleware, middlewares, controllers.tasks.module.getDetail);
};
