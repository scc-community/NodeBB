
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

var txlog = require('../scc').txLog;

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
	var data = {
		event: 'UserEmail.registerReward',
		uid: uid,
	};

	async.waterfall([
		function (next) {
			user.getInvitedcode(data.uid, next);
		},
		function (invitedcode, next) {
			data.invitedcode = invitedcode;
			if (invitedcode) {
				user.invitationcodeUid.get(data.invitedcode, next);
			} else {
				next(null, null);
			}
		},
		function (inviteduid, next) {
			data.inviteduid = inviteduid;
			if (data.inviteduid) {
				async.waterfall([
					function (next) {
						user.getSccToken(data.inviteduid, next);
					},
					function (invitedUidSccToken, next) {
						data.invitedUidSccToken = invitedUidSccToken;
						next();
					},
				], next);
			} else {
				next();
			}
		},
		function (next) {
			var recordSccToken = function (next) {
				async.waterfall([
					function (next) {
						user.getSccToken(data.uid, next);
					},
					function (uidSccToken, next) {
						data.uidSccToken = uidSccToken;
						next();
					},
					function (next) {
						if (data.inviteduid) {
							user.getSccToken(data.inviteduid, next);
						} else {
							next(null, null);
						}
					},
					function (invitedUidSccToken, next) {
						if (invitedUidSccToken) {
							data.invitedUidSccToken = invitedUidSccToken;
						}
						next();
					},
				], next);
			};
			var beginTransaction = function (next) {
				data.group_id = utils.generateUUID();
				txlog.begin(data, next);
			};
			var registerReward = function (next) {
				user.registerReward('register', data.uid, null, data, next);
			};
			var logRecord = function (next) {
				txlog.record(data, next);
			};
			var tasks = [];
			tasks.push(recordSccToken);
			tasks.push(beginTransaction);
			tasks.push(registerReward);
			tasks.push(logRecord);
			if (data.inviteduid) {
				var registerInvitedReward = function (next) {
					user.registerReward('register_invited', data.uid, { invitedUID: data.inviteduid }, data, next);
				};
				var inviteFriendReward = function (next) {
					user.registerReward('invite_friend', data.inviteduid, { inviteID: data.uid }, data, next);
				};
				var inviteExtraReward = function (next) {
					async.waterfall([
						function (next) {
							user.incrementUserFieldBy(data.inviteduid, 'invitationcount', 1, next);
						},
						function (invitationcount, next) {
							data.invitationcount = invitationcount;
							user.registerReward('invite_extra', data.inviteduid, { inviteID: data.uid, invitationCount: invitationcount }, data, next);
						},
					], next);
				};
				tasks.push(registerInvitedReward);
				tasks.push(logRecord);
				tasks.push(inviteFriendReward);
				tasks.push(logRecord);
				tasks.push(inviteExtraReward);
				tasks.push(logRecord);
			}
			tasks.push(recordSccToken);
			async.series(tasks, next);
		},
	], function (err) {
		if (err) {
			data.err = {
				message: err.message,
				stack: err.stack,
			};
		}
		txlog.end(data, callback);
	});
};

UserEmail.confirm = function (code, callback) {
	async.waterfall([
		function (next) {
			db.getObject('confirm:' + code, next);
		},
		function (confirmObj, next) {
			if (!confirmObj || !confirmObj.uid || !confirmObj.email) {
				return next(new Error('[[error:invalid-data]]'));
			}

			var checkConfirmFlag = function (uid, next) {
				async.waterfall([
					function (next) {
						user.getUserFields(uid, ['email:confirmed', 'email:confirmtime'], next);
					},
					function (data, next) {
						if (!data['email:confirmed']) {
							data['email:confirmed'] = '0';
							data['email:confirmtime'] = new Date().getTime();
							user.setUserFields(uid, data, function (err) {
								data.init = true;
								next(err, data);
							});
						} else {
							next(null, data);
						}
					},
					function (data, next) {
						switch (data['email:confirmed']) {
						case '1':
							return next(new Error('email confim was ended.'));
						case '0':
							if (data.init) {
								return next();
							}
							var checkTime = new Date(parseInt(data['email:confirmtime'], 10));
							checkTime.setSeconds(checkTime.getSeconds() + 10);
							var curTime = new Date();
							if (curTime < checkTime) {
								return next(new Error('email confim frequency is higher.'));
							}
							user.setUserField(uid, 'email:confirmtime', new Date().getTime(), next);
							break;
						default:
							return next(new Error('email:confirmed value is not exist.'));
						}
					},
				], next);
			};
			async.waterfall([
				function (next) {
					checkConfirmFlag(confirmObj.uid, next);
				},
				function (next) {
					UserEmail.registerReward(confirmObj.uid, next);
				},
				function (next) {
					async.series([
						async.apply(user.setUserFields, confirmObj.uid, {
							'email:confirmed': 1,
							'email:confirmtime': new Date().getTime(),
						}),
						async.apply(db.delete, 'confirm:' + code),
						async.apply(db.delete, 'uid:' + confirmObj.uid + ':confirm:email:sent'),
						function (next) {
							db.sortedSetRemove('users:notvalidated', confirmObj.uid, next);
						},
						function (next) {
							plugins.fireHook('action:user.email.confirmed', { uid: confirmObj.uid, email: confirmObj.email }, next);
						},
					], next);
				},
			], next);
		},
	], function (err) {
		callback(err);
	});
};
