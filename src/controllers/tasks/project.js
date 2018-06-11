'use strict';

var async = require('async');
var db = require('../../database');
var helpers = require('../helpers');
var pagination = require('../../pagination');
var privileges = require('../../privileges');
var scc = require('../../scc');

var projectController = module.exports;

projectController.get = function (req, res, callback) {
	var getStatusOptions = function () {
		var category = 'project_status';
		var statusItems = ['beginning', 'ended', 'balanced'];
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
			privileges.global.can('task:project:manage', req.uid, next);
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
							scc.project.getCount(next);
						},
						function (result, _, next) {
							next(null, result[0].count);
						},
					], next);
				},
				projects: function (next) {
					var projects = [];
					async.waterfall([
						function (next) {
							scc.project.getRows(initWhere(req), [{
								date_published: 'DESC',
							}], [start, resultsPerPage], next);
						},
						function (result, next) {
							result.forEach(function (item) {
								projects.push(item._data);
							});
							async.each(projects, function (row, next) {
								async.waterfall([
									function (next) {
										db.getObjectFields('user:' + row.publish_uid, ['username', 'userslug'], next);
									},
									function (userData, next) {
										row.publish_username = userData.username;
										row.publish_userslug = userData.userslug;
										row.status_text = scc.taskCategoryItem.find('id', row.status).content;
										next();
									},
								], next);
							}, function (err) {
								next(err, projects);
							});
						},
					], next);
				},
			}, next);
		},
		function (results) {
			var statusOptions = getStatusOptions();
			var data = {
				projects: results.projects,
				statusOptions: statusOptions,
				pagination: pagination.create(page, Math.max(1, Math.ceil(results.count / resultsPerPage)), req.query),
			};
			res.render('task/project', data);
		},
	], callback);
};

projectController.getDetail = function (req, res, callback) {
	if (parseInt(req.query.projectId, 10) <= 0) {
		return callback();
	}
	async.waterfall([
		function (next) {
			privileges.global.can('task:project:manage', req.uid, next);
		},
		function (canManage, next) {
			if (!canManage) {
				return helpers.notAllowed(req, res);
			}
			next();
		},
		function (next) {
			scc.project.getRows([{ key: 'id', value: req.query.projectId }], null, null, next);
		},
		function (result, next) {
			if (result.length !== 1) {
				return callback();
			}
			var project = result[0]._data;
			async.waterfall([
				function (next) {
					db.getObjectFields('user:' + project.publish_uid, ['username', 'userslug'], next);
				},
				function (userData, next) {
					project.publish_username = userData.username;
					project.publish_userslug = userData.userslug;
					project.status_text = scc.taskCategoryItem.find('id', project.status).content;
					next(null, project);
				},
			], next);
		},
		function (project, next) {
			async.parallel({
				architects: function (next) {
					var architects = [];
					async.waterfall([
						function (next) {
							scc.projectArchitect.getRows([{ key: 'p_id', value: project.id }], null, null, next);
						},
						function (result, next) {
							result.forEach(function (item) {
								architects.push(item._data);
							});
							async.each(architects, function (row, next) {
								async.waterfall([
									function (next) {
										db.getObjectFields('user:' + row.architect_uid, ['username', 'userslug'], next);
									},
									function (userData, next) {
										row.username = userData.username;
										row.userslug = userData.userslug;
										next();
									},
								], next);
							}, function (err) {
								next(err, architects);
							});
						},
					], next);
				},
				codeModules: function (next) {
					var codeModules = [];
					async.waterfall([
						function (next) {
							scc.vpcm.getRows([{ key: 'p_id', value: project.id }], null, null, next);
						},
						function (result, next) {
							result.codeModules(function (item) {
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
								], next);
							}, function (err) {
								next(err, codeModules);
							});
						},
					], next);
				},
				project: function (next) {
					next(null, project);
				},
			}, next);
		},
		function (results) {
			var data = {
				project: results.project,
				architects: results.architects,
				codeModules: results.codeModules,
			};
			res.render('task/project-detail', data);
		},
	], callback);
};
