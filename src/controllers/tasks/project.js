'use strict';

var nconf = require('nconf');
var async = require('async');

var user = require('../../user');
var posts = require('../../posts');
var plugins = require('../../plugins');
var meta = require('../../meta');

var helpers = require('../helpers');
var pagination = require('../../pagination');
var messaging = require('../../messaging');
var translator = require('../../translator');
var utils = require('../../utils');
var winston = require('winston');
var privileges = require('../../privileges');

var projectController = module.exports;

projectController.get = function (req, res, callback) {
	async.waterfall([
		function (next) {
			async.parallel({
				data: function (next) {
					// categories.getCategoryFields(cid, ['slug', 'disabled', 'topic_count'], next);
				},
				canManage: function (next) {
					privileges.global.can('task:project:manage', req.uid, next);
				},
			}, next);
		},
		function (results) {
			if (!results.canManage) {
				return helpers.notAllowed(req, res);
			}
			res.render('task/project', results);
		},
	], callback);
};

projectController.getDetail = function (req, res, callback) {
	var data;
	res.render('task/project-detail', data);
	callback();
};

