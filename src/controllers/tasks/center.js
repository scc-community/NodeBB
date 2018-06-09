'use strict';

var nconf = require('nconf');
var async = require('async');
var db = require('../../database');
var helpers = require('../helpers');
var pagination = require('../../pagination');
var privileges = require('../../privileges');
var scc = require('../../scc');

var CenterController = module.exports;

CenterController.initWhere = function (req) {
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

CenterController.get = function (req, res, callback) {
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	async.waterfall([
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
							scc.codeModule.getRows(CenterController.initWhere(req), [{
								date_published: 'DESC',
							}], [start, resultsPerPage], next);
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
				pagination: pagination.create(page, Math.max(1, Math.ceil(results.count / resultsPerPage)), req.query),
			};
			data.taskLink = {
				localTool: '',
				myTask: '/task/mytask',
				projectManage: '/task/project',
				codeModuleManage: '/task/module',
			};
			res.render('task/center', data);
		},
	], callback);
};

CenterController.getMyTask = function (req, res, callback) {
	if (req.uid === 0) {
		return helpers.notAllowed(req, res);
	}
	req.isMyTask = true;
	this.get(req, res, callback);
};

CenterController.getDetail = function (req, res, callback) {
	var data;
	res.render('task/center-detail', data);
	callback();
};
