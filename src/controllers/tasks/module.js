'use strict';

var async = require('async');
var db = require('../../database');
var scc = require('../../scc');
var helpers = require('../helpers');
var pagination = require('../../pagination');
var privileges = require('../../privileges');

var moduleController = module.exports;

moduleController.get = function (req, res, callback) {
	var getStatusOptions = function () {
		var includeItems = [
			{ item: 'draft' }, { item: 'published' }, { item: 'developing' },
			{ item: 'submited' }, { item: 'balanced' }, { item: 'closed' },
		];
		var result = scc.taskCategoryItem.getOptions('code_module_status', true, null, includeItems);
		return result;
	};
	var initWhere = function (req) {
		var where = [];
		if (req.query.filterByStatus) {
			where.push({
				key: 'status',
				value: req.query.filterByStatus,
			});
		}
		return where;
	};
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;
	async.waterfall([
		function (next) {
			privileges.global.can('task:module:manage', req.uid, next);
		},
		function (canManage, next) {
			if (!canManage) {
				return helpers.notAllowed(req, res);
			}
			next();
		},
		function (next) {
			async.parallel({
				codeModules: function (next) {
					var codeModules = [];
					async.waterfall([
						function (next) {
							scc.codeModule.getRows(initWhere(req), [{ date_published: 'DESC' }], [start, resultsPerPage], next);
						},
						function (result, next) {
							result.forEach(function (item) {
								codeModules.push(item._data);
							});
							async.each(codeModules, function (row, next) {
								async.waterfall([
									function (next) {
										db.getObjectFields('user:' + row.publish_uid, ['username', 'userslug'], next);
									},
									function (userData, next) {
										row.publish_username = userData.username;
										row.publish_userslug = userData.userslug;
										next();
									},
									function (next) {
										db.getObjectFields('user:' + row.accept_uid, ['username', 'userslug'], next);
									},
									function (userData, next) {
										row.accept_username = userData.username;
										row.accept_userslug = userData.userslug;
										row.date_published = row.date_published.toLocaleDateString();
										row.delivery_deadline = row.delivery_deadline.toLocaleDateString();
										row.status_text = scc.taskCategoryItem.find('id', row.status).content;
										next();
									},
								], next);
							}, function (err) {
								next(err, codeModules);
							});
						},
					], next);
				},
			}, next);
		},
		function (results) {
			var statusOptions = getStatusOptions();
			var data = {
				breadcrumbs: helpers.buildBreadcrumbs([{ text: '模块管理' }]),
				codeModules: results.codeModules,
				statusOptions: statusOptions,
				pagination: pagination.create(page, Math.max(1, Math.ceil(results.codeModules.length / resultsPerPage)), req.query),
			};
			res.render('task/module', data);
		},
	], callback);
};

moduleController.getDetail = function (req, res, callback) {
	var data = {
		languageOptions: scc.taskCategoryItem.getOptions('dev_language', { text: '请选择' }),
		appOptions: scc.taskCategoryItem.getOptions('app', { text: '请选择' }),
	};
	if (!helpers.checkId(req.query.cmid)) {
		data.breadcrumbs = helpers.buildBreadcrumbs([{ text: '模块管理', url: '/task/module' }, { text: '新建模块' }]);
		data.statusOptions = scc.taskCategoryItem.getOptions('code_module_status', false, { item: 'draft' });
		res.render('task/moduledetail', data);
		return;
	}
	var codeModule;
	async.waterfall([
		function (next) {
			privileges.global.can('task:module:manage', req.uid, next);
		},
		function (canManage, next) {
			if (!canManage) { return helpers.notAllowed(req, res); }
			next();
		},
		function (next) {
			scc.codeModule.getRows([{ key: 'id', value: req.query.cmid }], null, null, next);
		},
		function (result, next) {
			if (result.length !== 1) { return callback(); }
			codeModule = result[0]._data;
			codeModule.status_text = scc.taskCategoryItem.find('id', codeModule.status).content;
			codeModule.delivery_deadline = codeModule.delivery_deadline.toLocaleDateString();
			codeModule.date_upload = codeModule.date_upload.toLocaleDateString();
			codeModule.dev_language = codeModule.dev_language.split(',').map(function (item) {
				return { text: item };
			});
			codeModule.app = codeModule.app.split(',').map(function (item) {
				return { text: item };
			});
			db.getObjectFields('user:' + codeModule.publish_uid, ['username', 'userslug'], next);
		},
		function (userData, next) {
			codeModule.publish_username = userData.username;
			codeModule.publish_userslug = userData.userslug;
			next();
		},
		function (next) {
			db.getObjectFields('user:' + codeModule.accept_uid, ['username', 'userslug'], next);
		},
		function (userData, next) {
			codeModule.accept_username = userData.username;
			codeModule.accept_userslug = userData.userslug;
			next();
		},
		function () {
			var status = scc.taskCategoryItem.find('id', codeModule.status);
			data.breadcrumbs = helpers.buildBreadcrumbs([{ text: '模块管理', url: '/task/module' }, { text: '模块详情' }]);
			data.codemodule = codeModule;
			data.statuses = scc.taskCategoryItem.getCodeModuleStatuses(codeModule.status);
			data.statusOptions = scc.taskCategoryItem.getOptions('code_module_status', false, {
				category: status.category,
				item: status.item,
			});
			res.render('task/moduledetail', data);
		},
	], callback);
};
