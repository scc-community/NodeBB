
'use strict';

var async = require('async');
var nconf = require('nconf');

var user = require('../user');
var utils = require('../utils');
var translator = require('../translator');
var plugins = require('../plugins');
var db = require('../database');
var meta = require('../meta');
var emailer = require('../emailer');
var scc = require('../scc');
var UserEmail = module.exports;

UserEmail.exists = function (email, callback) {
	user.getUidByEmail(email.toLowerCase(), function (err, exists) {
		callback(err, !!exists);
	});
};

UserEmail.available = function (email, callback) {
	db.isSortedSetMember('email:uid', email.toLowerCase(), function (err, exists) {
		callback(err, !exists);
	});
};

UserEmail.sendValidationEmail = function (uid, options, callback) {
	/*
	 * 	Options:
	 * 		- email, overrides email retrieval
	 * 		- force, sends email even if it is too soon to send another
	 */

	// Handling for 2 arguments
	if (arguments.length === 2 && typeof options === 'function') {
		callback = options;
		options = {};
	}

	// Fallback behaviour (email passed in as second argument)
	if (typeof options === 'string') {
		options = {
			email: options,
		};
	}

	callback = callback || function () {};
	var confirm_code = utils.generateUUID();
	var confirm_link = nconf.get('url') + '/confirm/' + confirm_code;

	var emailInterval = meta.config.hasOwnProperty('emailConfirmInterval') ? parseInt(meta.config.emailConfirmInterval, 10) : 10;

	async.waterfall([
		function (next) {
			// If no email passed in (default), retrieve email from uid
			if (options.email && options.email.length) {
				return setImmediate(next, null, options.email);
			}

			user.getUserField(uid, 'email', next);
		},
		function (email, next) {
			options.email = email;
			if (!options.email) {
				return callback();
			}

			if (options.force) {
				return setImmediate(next, null, false);
			}

			db.get('uid:' + uid + ':confirm:email:sent', next);
		},
		function (sent, next) {
			if (sent) {
				return next(new Error('[[error:confirm-email-already-sent, ' + emailInterval + ']]'));
			}
			next();

		},
		function (next) {
			plugins.fireHook('filter:user.verify.code', confirm_code, next);
		},
		function (_confirm_code, next) {
			confirm_code = _confirm_code;
			db.setObject('confirm:' + confirm_code, {
				email: options.email.toLowerCase(),
				uid: uid,
			}, next);
		},
		function (next) {
			db.expireAt('confirm:' + confirm_code, Math.floor((Date.now() / 1000) + (60 * 60 * 24)), next);
		},
		function (next) {
			user.getUserField(uid, 'username', next);
		},
		function (username, next) {
			var title = username || meta.config.title || meta.config.browserTitle || 'NodeBB';
			translator.translate('[[email:welcome-to, ' + title + ']]', meta.config.defaultLang, function (subject) {
				var data = {
					username: username,
					confirm_link: confirm_link,
					confirm_code: confirm_code,

					subject: subject,
					template: 'welcome',
					uid: uid,
				};

				if (plugins.hasListeners('action:user.verify')) {
					plugins.fireHook('action:user.verify', { uid: uid, data: data });
					next();
				} else {
					emailer.send('welcome', uid, data, next);
				}
			});
		},
		function (next) {
			next(null, confirm_code);
		},
	], callback);
};

UserEmail.registerReward = function (uid, callback) {
	async.waterfall([
		function (next) {
			user.registerReward('register', uid, null, next);
		},
		function (next) {
			user.getInvitedcode(uid, next);
		},
		function (invitedode, next) {
			if (invitedode) {
				user.invitationcodeUid.get(invitedode, next);
			} else {
				return callback();
			}
		},
		function (inviteduid, next) {
			if (inviteduid) {
				async.series([
					async.apply(user.registerReward, 'register_invited', uid, null),
					async.apply(user.registerReward, 'invite_friend', inviteduid, null),
					function (next) {
						async.waterfall([
							function (next) {
								user.incrementUserFieldBy(inviteduid, 'invitationcount', 1, next);
							},
							function (invitationcount, next) {
								user.registerReward('invite_extra', inviteduid, invitationcount, next);
							},
						], next);
					},
				], next);
			} else {
				return callback();
			}
		},
		function (_, next) {
			next();
		},
	], callback);
};

UserEmail.confirm = function (code, callback) {
	scc.tx.getTxs('limit 30', null, function (results, err, cb) {
		console.log(results);
	});
	async.waterfall([
		function (next) {
			db.getObject('confirm:' + code, next);
		},
		function (confirmObj, next) {
			if (!confirmObj || !confirmObj.uid || !confirmObj.email) {
				return next(new Error('[[error:invalid-data]]'));
			}
			async.waterfall([
				function (next) {
					UserEmail.registerReward(confirmObj.uid, next);
				},
				function (next) {
					async.series([
						async.apply(user.setUserField, confirmObj.uid, 'email:confirmed', 1),
						// async.apply(db.delete, 'confirm:' + code),
						// async.apply(db.delete, 'uid:' + confirmObj.uid + ':confirm:email:sent'),
						// function (next) {
						// 	db.sortedSetRemove('users:notvalidated', confirmObj.uid, next);
						// },
						// function (next) {
						// 	plugins.fireHook('action:user.email.confirmed', { uid: confirmObj.uid, email: confirmObj.email }, next);
						// },
					], next);
				},
			], next);
		},
	], function (err) {
		callback(err);
	});
};
