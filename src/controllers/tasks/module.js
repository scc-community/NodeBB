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
		var category = 'code_module_status';
		var statusItems = ['draft', 'published', 'developing', 'submited', 'balanced', 'closed'];
		var data = [];
		data.push([
			{
				value: null,
				text: scc.taskCategoryItem.get(category, 'all').content,
			},
		]);
		statusItems.forEach(function (statusItem) {
			data.push({
				value: scc.taskCategoryItem.get(category, statusItem).id,
				text: scc.taskCategoryItem.get(category, statusItem).content,
			});
		});
		return data;
	};
	var initWhere = function (req) {
		var where =
		[
			// {
			// 	key: 'publish_uid',
			// 	value: req.uid,
			// },
		];
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
				count: function (next) {
					async.waterfall([
						function (next) {
							scc.codeModule.getCount(next);
						},
						function (result, _, next) {
							next(null, result[0].count);
						},
					], next);
				},
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
										next();
									},
									function (next) {
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
				codeModules: results.codeModules,
				statusOptions: statusOptions,
				pagination: pagination.create(page, Math.max(1, Math.ceil(results.count / resultsPerPage)), req.query),
			};
			res.render('task/module', data);
		},
	], callback);
};

moduleController.getDetail = function (req, res, callback) {
	if (parseInt(req.query.moduleId, 10) <= 0) {
		return callback();
	}
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
			scc.codeModule.getRows([{ key: 'id', value: req.query.moduleId }], null, null, next);
		},
		function (result, next) {
			if (result.length !== 1) {
				return callback();
			}
			var codeModule = result[0]._data;
			async.waterfall([
				function (next) {
					db.getObjectFields('user:' + codeModule.publish_uid, ['username', 'userslug'], next);
				},
				function (userData, next) {
					codeModule.username = userData.username;
					codeModule.userslug = userData.userslug;
					codeModule.status_text = scc.taskCategoryItem.find('id', codeModule.status).content;
					next(null, codeModule);
				},
			], next);
		},
		function (codeModule) {
			var data = {
				codeModule: codeModule,
			};
			res.render('task/module-detail', data);
		},
	], callback);
};
