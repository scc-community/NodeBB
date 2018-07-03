'use strict';

var Class = require('better-js-class');
var async = require('async');
var mysql = require('mysql');
var $U = require('underscore');

var getValue = function (o) {
	for (var k in o) {
		if (o.hasOwnProperty(k)) {
			return o[k];
		}
	}
};

module.exports = (function () {
	var DB = Class({
		_init: function (cfg) {
			var transactionOverride = cfg.useTransaction;
			delete cfg.useTransaction;

			this._cfg = cfg;
			// console.log(this._cfg);
			this._pool = mysql.createPool(this._cfg);

			if (transactionOverride) {
				this._transactionCfg = this._buildCfg(cfg, transactionOverride);
				// console.log('transactionCfg:', this._transactionCfg);
				this._transactionPool = mysql.createPool(this._transactionCfg);
			}

			this._schema = {};
			this._prepared = false;
		},

		_buildCfg: function (cfg, override) {
			var res = {};

			for (var k in cfg) {
				if (cfg.hasOwnProperty(k)) {
					res[k] = cfg[k];
				}
			}

			$U.extend(res, override);
			return res;
		},

		connect: function (proc, callback) {
			var me = this;
			async.waterfall([
				function (next) {
					me.prepare(next);
				},
				function (conn, next) {
					proc(conn, next);
					conn.release();
				},
			], callback);
		},

		prepare: function (callback) {
			var me = this;
			var conn;

			async.waterfall([
				function (next) {
					me._pool.getConnection(next);
				},
				function (connection, next) {
					conn = connection;
					if (me._prepared) {
						return callback(null, conn);
					}
					conn.query('show tables', next);
				},
				function (tables, fieldPacket, next) {
					async.eachSeries(tables, function (table, next) {
						var tableName = getValue(table);
						async.waterfall([
							function (next) {
								conn.query('desc ' + tableName, next);
							},
							function (columns, fieldPackets, next) {
								me._schema[tableName] = $U.map(columns, function (column) {
									return column.Field;
								});
								next();
							},
						], next);
					}, next);
				},
				function (next) {
					me._prepared = true;
					next(null, conn);
				},
			], callback);
		},

		transaction: function (proc, callback) {
			var me = this;
			if (!me._transactionPool) {
				callback(new Error('transaction-not-setup-error'));
				return;
			}
			var txnConn;
			async.waterfall([
				function (next) {
					me._transactionPool.getConnection(next);
				},
				function (conn, next) {
					conn.beginTransaction(function (err) {
						if (!err) {
							txnConn = conn;
						}
						next(err);
					});
				},
				function (next) {
					proc(txnConn, next);
				},
				function (next1, next2, next3) {
					var next;
					if (typeof next1 === 'function') {
						next = next1;
					} else if (typeof next2 === 'function') {
						next = next2;
					} else if (typeof next3 === 'function') {
						next = next3;
					}
					txnConn.commit(next);
				},
			], function (err) {
				if (txnConn) {
					if (err) {
						txnConn.rollback();
					}
					txnConn.release();
				}
				callback(err);
			});
		},

		end: function () {
			this._pool.end();
			if (this._transactionPool) {
				this._transactionPool.end();
			}
		},
	});

	$U.extend(DB, {
		format: function (str, bindings) {
			var l = str.split('?');

			if (l.length - 1 !== bindings.length) {
				console.error(new Error('sql string format error'));
				return '';
			}

			var res = [];

			for (var i = 0; i < bindings.length; i++) {
				res.push(l[i]);
				res.push(mysql.escape(bindings[i]));
			}

			res.push(l[l.length - 1]);

			return res.join(' ');
		},
	});

	return DB;
}());
