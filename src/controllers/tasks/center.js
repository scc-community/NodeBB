'use strict';

var nconf = require('nconf');
var async = require('async');
var db = require('../../database');
var helpers = require('../helpers');
var pagination = require('../../pagination');
var privileges = require('../../privileges');
var scc = require('../../scc');

var CenterController = module.exports;

CenterController.get = function (req, res, callback) {
	var initWhere = function (req) {
		var where = [];
		if (req.isMyTask) {
			where.push({
				key: 'accept_uid',
				value: req.uid,
			});
		}
		where.push({
			key: 'status',
			value: 151, // 未发布
			compaser: '!=',
		});
		return where;
	};
	var initOrderBy = function () {
		var orderCondition = [
			{
				status: 'ASC',
			},
			{
				date_published: 'ASC',
			},
		];
		return orderCondition;
	};
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	async.waterfall([
		function (next) {
			async.parallel({
				codeModules: function (next) {
					var codeModules = [];
					async.waterfall([
						function (next) {
							scc.codeModule.getRows(initWhere(req), initOrderBy(), [start, resultsPerPage], next);
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
										row.username = userData.username;
										row.userslug = userData.userslug;
										row.date_published_text = row.date_published ? row.date_published.toLocaleDateString() : null;
										row.status_text = scc.taskCategoryItem.getCodeModuleStatusText('client', row.status);
										row.delivery_deadline_text = row.delivery_deadline ? row.delivery_deadline.toLocaleDateString() : null;
										row.date_cutoff_text = row.date_cutoff ? row.date_cutoff.toLocaleDateString() : null;
										row.languages = row.dev_language ? row.dev_language.split(',') : [];
										next();
									},
								], next);
							}, function (err) {
								next(err, codeModules);
							});
						},
					], next);
				},
				canManageModule: function (next) {
					privileges.global.can('task:module:manage', req.uid, next);
				},
				canManageProject: function (next) {
					privileges.global.can('task:project:manage', req.uid, next);
				},
			}, next);
		},
		function (results) {
			var data = {
				centerCid: nconf.get('task').centerCid,
				codeModules: results.codeModules,
				isMyTask: req.isMyTask,
				canManageModule: results.canManageModule,
				canManageProject: results.canManageProject,
				breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[global:task.center]]' }]),
				pagination: pagination.create(page, Math.max(1, Math.ceil(results.codeModules.length / resultsPerPage)), req.query),
			};

			var breadCrumbParams;
			if (req.isMyTask) {
				breadCrumbParams = [{ text: '[[global:task.center]]', url: '/task/center' }, { text: '我的任务' }];
			} else {
				breadCrumbParams = [{ text: '[[global:task.center]]' }];
			}
			data.breadcrumbs = helpers.buildBreadcrumbs(breadCrumbParams);
			data.taskLink = { localTool: '', myTask: '/task/mytask', projectManage: '/task/project', codeModuleManage: '/task/module' };
			res.render('task/center', data);
		},
	], callback);
};

CenterController.getMyTask = function (req, res, callback) {
	if (req.uid === 0) {
		return helpers.notAllowed(req, res);
	}
	req.isMyTask = true;
	CenterController.get(req, res, callback);
};

CenterController.getDetail = function (req, res, callback) {
	if (parseInt(req.query.codeModuleId, 10) <= 0) {
		return callback();
	}
	var initWhere = function (req) {
		var where = [];
		where.push({
			key: 'id',
			value: req.query.codeModuleId,
		});
		return where;
	};
	async.waterfall([
		function (next) {
			scc.codeModule.getRows(initWhere(req), null, null, next);
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
					codeModule.status_text = scc.taskCategoryItem.getCodeModuleStatusText('client', codeModule.status);
					codeModule.delivery_deadline_text = codeModule.delivery_deadline ? codeModule.delivery_deadline.toLocaleDateString() : null;
					codeModule.date_published_text = codeModule.date_published ? codeModule.date_published.toLocaleDateString() : null;
					codeModule.date_cutoff_text = codeModule.date_cutoff ? codeModule.date_cutoff.toLocaleDateString() : null;
					codeModule.date_upload_text = codeModule.date_upload ? codeModule.date_upload.toLocaleString() : null;
					codeModule.languages = codeModule.dev_language ? codeModule.dev_language.split(',') : [];
					next(null, codeModule);
				},
			], next);
		},
		function (codeModule) {
			var data = {
				breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[global:task.center]]', url: '/task/center' }, { text: '[[global:task.center.detail]]' }]),
				status: scc.taskCategoryItem.getCodeModuleStatuses(codeModule.status),
				codeModule: codeModule,
				isMyTask: req.uid === codeModule.accept_uid,
			};
			res.render('task/centerdetail', data);
		},
	], callback);
};
