'use strict';

var async = require('async');
var db = require('../../database');
var user = require('../../user');
var helpers = require('../helpers');
var accountHelpers = require('./helpers');
var pagination = require('../../pagination');
var scc = require('../../scc');

var sccController = module.exports;

sccController.get = function (req, res, callback) {
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	var txsData = {};
	var totalCount = 0;
	var sccTokenNumber = 0;

	var results = [];
	async.waterfall([
		function (next) {
			accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, next);
		},
		function (data, next) {
			txsData = data;
			scc.tx.getCount(next);
		},
		function (result, _, next) {
			totalCount = result[0].count;
			next(null);
		},
		function (next) {
			user.getSccToken(txsData.uid, next);
		},
		function (tokenNumber, next) {
			sccTokenNumber = tokenNumber;
			next();
		},
		function (next) {
			scc.tx.getRows([{ key: 'uid', value: txsData.uid }], null, [start, resultsPerPage], next);
		},
		function (datas, next) {
			datas.forEach(function (item) {
				results.push(item._data);
			});
			async.each(results, function (item, next) {
				item.transactionTypeText = scc.tx.getTransactionTypeText(item.transaction_type);
				item.rewardtypeText = scc.rewardType.find('id', item.reward_type).content;
				async.waterfall([
					function (next) {
						db.getObjectField('user:' + item.transaction_uid, 'username', next);
					},
					function (username, next) {
						if (!username) {
							username = '[[user:forum.username]]';
						}
						item.transactionUsername = username;
						next();
					},
				], next);
			}, function (err) {
				next(err);
			});
		},
		function () {
			txsData.page = page;
			txsData.memo = req.query.memo;
			txsData.ownToken = txsData.username + '[[user:scc.own-token]]' + sccTokenNumber;
			txsData.title = '[[pages:account/scc, ' + txsData.username + ']]';
			txsData.breadcrumbs = helpers.buildBreadcrumbs([
				{
					text: txsData.username,
					url: '/user/' + txsData.userslug,
				},
				{
					text: '[[user:scc]]',
				},
			]);

			if (results.length > 0) {
				var pageCount = Math.max(1, Math.ceil(totalCount / resultsPerPage));
				txsData.txs = results;
				txsData.pageCount = pageCount;
				txsData.pagination = pagination.create(page, pageCount, req.query);
			}
			res.render('account/scc', txsData);
		},
	], callback);
};
