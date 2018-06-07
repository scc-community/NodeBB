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


var centerController = module.exports;

centerController.get = function (req, res, callback) {
	var data;
	res.render('task/center', data);
	callback();
};

centerController.getDetail = function (req, res, callback) {
	var data;
	res.render('task/center-detail', data);
	callback();
};
