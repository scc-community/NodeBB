'use strict';

var async = require('async');
var db = require('./../database');
var utils = require('../utils');

var invite = {};

invite.createInviteLink = function (uid, callback) {
	callback = callback || function () {};
	var token = utils.generateUUID();
	async.waterfall([
		function (next) {
			db.setObjectField('scc:invition:uid', uid, token, next);
		},
		function (next) {
			db.setObjectField('scc:invition:token', token, uid, next);
		},
	], callback);
};

invite.verifyInvitation = function (query, callback) {
	if (!query.token) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	async.waterfall([
		function (next) {
			db.getObjectField('scc:invition:token', query.token, next);
		},
		function (uid, next) {
			if (!uid) {
				return next(new Error('[[error:invalid-token]]'));
			}
			next();
		},
	], callback);
};

module.exports = invite;
