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
	console.log('sccController.get req.uid=' + req.uid);
	console.log('req.query.page:' + req.query.page);
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 30;
	var start = Math.max(0, page - 1) * resultsPerPage;
	var stop = start + resultsPerPage - 1;
	console.log('page=' + page + ', start=' + start + ',stop=' + stop);

	var userData;
	async.waterfall([
		function (next) {
			accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid, next);
		},
		function (data, next) {
			userData = data;
			scc.tx.getTxs('where uid = ?', [req.uid], next);
		},
		function (results) {
			console.log('len=' + results.length);
			console.log('json:' + JSON.stringify(results[0]._data));
			console.log('json:' + JSON.stringify(results[1]._data));

			var txsResult = [];
			for (var index = 0; index < results.length; index++) {
				txsResult[index] = results[index]._data;
			}

			var pageCount = Math.max(1, Math.ceil(results.length / resultsPerPage));
			console.log('pageCount:' + pageCount);
			console.log('username:' + userData.username + ', userslug:' + userData.userslug);
			var txsData = {
				txs: txsResult,
				page: page,
				pageCount: pageCount,
				pagination: pagination.create(page, pageCount, req.query),
				hashMemo: false,
				title: '[[pages:account/scc, ' + userData.username + ']]',
				breadcrumbs: helpers.buildBreadcrumbs([
					{
						text: userData.username,
						url: '/user/' + userData.userslug,
					},
					{
						text: '[[user:scc]]',
					},
				]),
			};

			console.log('txsData:' + JSON.stringify(txsData));
			res.render('account/scc', txsData);
		},
	], callback);


	// async.waterfall([
	// 	function (next) {
	// 		scc.tx.getTxs('where uid = ?', [req.uid], next);
	// 	},
	// 	function (results, next) {
	// 		var txsResult = {};
	// 		results.forEach(function (result, index) {
	// 			txsResult[index].scc = result.scc;
	// 			// txsResult[index] = result.map(function (uid, transaction_type, tx_no, scc) {
	// 			// 	return {
	// 			// 		uid: uid,
	// 			// 		transaction_type: transaction_type,
	// 			// 		tx_no: tx_no,
	// 			// 		scc: scc,
	// 			// 	};
	// 			// });
	// 		});
	// 		next();
	// 	},
	// 	function (results, next) {
	// 		// console.log('result1=' + txsResult);
	// 		// console.log('result2=' + JSON.stringify(results[0].scc));
	// 		// console.log('result3=' + JSON.stringify(txsResult));
	// 		// next();
    //
	// 		// var txsResult = result;
	// 		// var txsData = {
	// 		// 	txs: txsResult,
	// 		// 	page: page,
	// 		// 	pageCount: Math.max(1, Math.ceil(txsResult.length / resultsPerPage)),
	// 		//  hashMemo: false,
	// 		// };
	// 		// // console.log('txsData=' + JSON.stringify(txsData));
	// 		// res.render('account/scc', JSON.stringify(results[0]._data));
	// 		next();
	// 	},
	// ], function (err) {
	// 	if (err) {
	// 		return callback(err);
	// 	}
	// });
};
