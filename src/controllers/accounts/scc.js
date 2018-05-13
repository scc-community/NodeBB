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

var sccController = module.exports;

sccController.get = function (req, res, callback) {
	// console.log('sccController.get req.uid=' + req.uid);
	// console.log('req.query.page:' + req.query.page + ', memo:' + req.query.memo);
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 5;
	var start = Math.max(0, page - 1) * resultsPerPage;
	var stop = start + resultsPerPage - 1;
	// console.log('page=' + page + ', start=' + start + ',stop=' + stop);

	var txsData = {};
	var totalCount = 0;
	var sccTokenNumber = 0;
	// console.log('totalCount1:' + totalCount);
	async.waterfall([
		function (next) {
			// console.log('before getTxs');
			scc.tx.getTxs('where uid = ?', [req.uid], next);
			// console.log('after getTxs');
		}, 
		function (totalResult, next) {
			if (undefined != totalResult) {
				totalCount = totalResult.length;
				// console.log('totalCount:' + totalCount);
			}
			next();
		},
		function (next) {
			user.getSccToken(req.uid, '', next);
		},
		function (tokenNumber, next) {
			// console.log('sccTokenNumber:' + tokenNumber);
			sccTokenNumber = tokenNumber;
			next();
		},
		function (next) {
			// console.log('before getUserDataByUserSlug');
			accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, next);
			// console.log('after getUserDataByUserSlug');
		},
		function (data, next) {
			// console.log('before getTxs2');
			txsData = data;
			scc.tx.getTxs('where uid = ?' + ' limit ' + start + ',' + resultsPerPage, [req.uid], next);
			// console.log('after getTxs2');
		},
		function (results) {
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

			if (results != undefined && results.length > 0) {
				var txsResult = [];
				for (var index = 0; index < results.length; index++) {
					txsResult[index] = results[index]._data;
				}
	
				var pageCount = Math.max(1, Math.ceil(totalCount / resultsPerPage));
				// console.log('pageCount:' + pageCount);
				// console.log('username:' + txsData.username + ', userslug:' + txsData.userslug);
				txsData.txs = txsResult;
				txsData.pageCount = pageCount;
				txsData.pagination = pagination.create(page, pageCount, req.query);
	
				// console.log('txsData:' + JSON.stringify(txsData));
			}
			res.render('account/scc', txsData);
		},
	], callback);
};
