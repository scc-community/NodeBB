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
var privileges = require('../../privileges');

var centerController = module.exports;

centerController.get = function (req, res, callback) {
	async.waterfall([
		function (next) {
			async.parallel({
				data: function (next) {
					// categories.getCategoryFields(cid, ['slug', 'disabled', 'topic_count'], next);
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
			res.render('task/center', results);
		},
	], callback);
};

centerController.getDetail = function (req, res, callback) {
	var data;
	res.render('task/center-detail', data);
	callback();
};
