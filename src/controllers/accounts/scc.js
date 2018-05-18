'use strict';

var async = require('async');

var db = require('../../database');
var user = require('../../user');
var meta = require('../../meta');
var plugins = require('../../plugins');
var helpers = require('../helpers');
var groups = require('../../groups');
var accountHelpers = require('./helpers');
var privileges = require('../../privileges');
var pagination = require('../../pagination');
var file = require('../../file');
var scc = require('../../scc');
var winston = require('winston');

var sccController = module.exports;

sccController.get = function (req, res, callback) {
	// console.log('sccController.get req.uid=' + req.uid);
	// console.log('req.query.page:' + req.query.page + ', memo:' + req.query.memo);
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 30;
	var start = Math.max(0, page - 1) * resultsPerPage;
	var stop = start + resultsPerPage - 1;
	// console.log('page=' + page + ', start=' + start + ',stop=' + stop);

	var txsData = {};
	var totalCount = 0;
	var sccTokenNumber = 0;
	// console.log('totalCount1:' + totalCount);

	var results = [];
	async.waterfall([
		function (next) {
			accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, next);
		},
		function (data, next) {
			txsData = data;
			scc.tx.getTxs('where uid = ?', [txsData.uid], next);
		},
		function (totalResult, next) {
			if (undefined !== totalResult) {
				totalCount = totalResult.length;
				// console.log('totalCount:' + totalCount);
			}
			next();
		},
		function (next) {
			user.getSccToken(txsData.uid, next);
		},
		function (tokenNumber, next) {
			// console.log('sccTokenNumber:' + tokenNumber);
			sccTokenNumber = tokenNumber;
			next();
		},
		function (next) {
			scc.tx.getTxs('where uid = ?' + ' limit ' + start + ',' + resultsPerPage, [txsData.uid], next);
		},
		function (datas, next) {
			datas.forEach(function (item) {
				results.push(item._data);
			});
			async.each(results, function (item, next) {
				item.transactionTypeText = scc.tx.getTransactionTypeText(item.transaction_type);
				item.rewardtypeText = scc.rewardType.getRewardTypeText(item.reward_type);
				async.waterfall([
					function (next) {
						db.getObjectField('user:' + item.transaction_uid, 'username', next);
					},
					function (username, next) {
						item.transactionUsername = username;
						next();
					},
				], next);
			}, function (err) {
				next(err);
			});
		},
		function () {
			// console.log('len=' + results.length);
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
				// console.log('pageCount:' + pageCount);
				// console.log('username:' + txsData.username + ', userslug:' + txsData.userslug);
				txsData.txs = results;
				txsData.pageCount = pageCount;
				txsData.pagination = pagination.create(page, pageCount, req.query);

				// console.log('txsData:' + JSON.stringify(txsData));
			}
			res.render('account/scc', txsData);
		},
	], callback);
};
