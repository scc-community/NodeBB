'use strict';

var async = require('async');
var fs = require('fs');
var validator = require('validator');
var crypto = require('crypto');
var zip = require('node-native-zip');
var path = require('path');
var file = require('../../file');
var db = require('../../database');
var helpers = require('../helpers');
var pagination = require('../../pagination');
var privileges = require('../../privileges');
var scc = require('../../scc');

var projectController = module.exports;

projectController.get = function (req, res, callback) {
	var getStatusOptions = function () {
		var includeItems = [{ item: 'beginning' }, { item: 'ended' }, { item: 'balanced' }];
		var result = scc.taskCategoryItem.getOptions('project_status', true, null, includeItems);
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
				breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[global:task.center]]', url: '/task/center' }, { text: '项目管理' }]),
				pagination: pagination.create(page, Math.max(1, Math.ceil(results.projects.length / resultsPerPage)), req.query),
			};
			res.render('task/project', data);
		},
	], callback);
};

projectController.getDetail = function (req, res, callback) {
	if (!helpers.checkId(req.query.pid)) {
		var data = {
			breadcrumbs: helpers.buildBreadcrumbs([{ text: '项目管理', url: '/task/project' }, { text: '新建项目' }]),
			statuses: scc.taskCategoryItem.getOptions('project_status', false, {
				item: 'beginning',
			}),
		};
		res.render('task/projectdetail', data);
		return;
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
			scc.project.getRows([{ key: 'id', value: req.query.pid }], null, null, next);
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
					project.delivery_deadline = project.delivery_deadline ? project.delivery_deadline.toLocaleDateString() : null;
					next(null, project);
				},
			], next);
		},
		function (project, next) {
			async.parallel({
				projectArchitects: function (next) {
					var projectArchitects = [];
					async.waterfall([
						function (next) {
							scc.projectArchitect.getRows([{ key: 'p_id', value: project.id }], null, null, next);
						},
						function (result, next) {
							result.forEach(function (item) {
								projectArchitects.push(item._data);
							});
							async.each(projectArchitects, function (row, next) {
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
								next(err, projectArchitects);
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
							result.forEach(function (item) {
								codeModules.push(item._data);
							});
							async.each(codeModules, function (row, next) {
								async.waterfall([
									function (next) {
										db.getObjectFields('user:' + row.cm_accept_uid, ['username', 'userslug'], next);
									},
									function (userData, next) {
										row.accept_username = userData.username;
										row.accept_userslug = userData.userslug;
										row.status_text = scc.taskCategoryItem.find('id', row.cm_status).content;
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
			var status = scc.taskCategoryItem.find('id', results.project.status);
			var data = {
				breadcrumbs: helpers.buildBreadcrumbs([{ text: '项目管理', url: '/task/project' }, { text: '项目详情' }]),
				project: results.project,
				projectArchitects: results.projectArchitects,
				codeModules: results.codeModules,
				projectStatusIsBalanced: status.id === scc.taskCategoryItem.get('project_status', 'balanced').id,
				statuses: scc.taskCategoryItem.getOptions('project_status', false, {
					category: status.category,
					item: status.item,
				}),
			};
			res.render('task/projectdetail', data);
		},
	], callback);
};

projectController.downloadCodeModulePackage = function (req, res, callback) {
	var initWhere = function (req) {
		var where = [];
		where.push({
			key: 'p_id',
			value: req.query.pid,
		});
		where.push({
			key: 'cm_id',
			value: req.query.cmid,
		});
		return where;
	};

	if (!helpers.checkId(req.query.pid)) {
		return callback();
	}
	var projectFirstRowData;
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
			scc.vpcm.getRows(initWhere(req), null, null, next);
		},
		function (result, next) {
			if (result.length === 0) {
				return callback();
			}
			projectFirstRowData = result[0]._data;
			makeCodeMoudleZip(result, next);
		},
		function (zipPath, zipFile, next) {
			var data = { id: projectFirstRowData.p_id };
			if (!file.existsSync(zipPath)) {
				data.codemodule_url = null;
			} else {
				projectFirstRowData.zipPath = zipPath;
				projectFirstRowData.zipFile = zipFile;
				data.codemodule_url = zipFile;
			}
			scc.project.updateRow(null, data, next);
		},
		function (_, next) {
			if (!projectFirstRowData.zipPath) {
				return callback();
			}
			var filename = path.basename(projectFirstRowData.zipPath);
			res.writeHead(200, {
				'content-type': 'application/force-download',
				'content-disposition': 'attachment; filename=' + filename,
			});
			var f = fs.createReadStream(projectFirstRowData.zipPath);
			f.pipe(res).on('close', next);
		},
	], callback);
};

function makeCodeMoudleZip(vpcmResult, callback) {
	var archive;
	var zipFile;
	var zipPath;
	var row0 = vpcmResult[0]._data;
	var codemoduleFiles = [];
	vpcmResult.forEach(function (item) {
		var url = item._data.cm_url;
		if (url) {
			var codemoduleFilePath = path.resolve(__dirname, '../../..') + url.replace('/assets', '/public');
			if (file.existsSync(codemoduleFilePath)) {
				var name = path.basename(codemoduleFilePath);
				codemoduleFiles.push({
					name: name,
					path: codemoduleFilePath,
				});
				zipFile += name;
			}
		}
	});
	var title = row0.p_title;
	zipFile = title + '-' + validator.escape(crypto.createHash('md5').update(zipFile).digest('hex')) + '.zip';
	async.waterfall([
		function (next) {
			if (row0.p_codemodule_url !== zipFile) {
				next();
			} else {
				zipFile = row0.p_codemodule_url;
				zipPath = path.resolve(__dirname, '../../..') + '/public/uploads/files/' + zipFile;
				return callback(null, zipPath, zipFile);
			}
		},
		function (next) {
			archive = new zip();
			archive.addFiles(codemoduleFiles, next);
		},
		function (next) {
			var buff = archive.toBuffer();
			zipPath = path.resolve(__dirname, '../../..') + '/public/uploads/files/' + zipFile;
			fs.writeFile(zipPath, buff, next);
		},
		function (next) {
			next(null, zipPath, zipFile);
		},
	], callback);
}
