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

var projectController = module.exports;

projectController.get = function (req, res, callback) {
	var data;
	res.render('task/project', data);
	callback();
};

projectController.getDetail = function (req, res, callback) {
	var data;
	res.render('task/project-detail', data);
	callback();
};

