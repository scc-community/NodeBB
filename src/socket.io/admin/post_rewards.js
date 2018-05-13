'use strict';

var async = require('async');
var dataProvider = require("../../post_rewards");
var winston = require('winston');

var SCC = module.exports;

SCC.getUnvested = function (socket, filters, callback) {
	dataProvider.getUnvestedRewards(filters.postType, filters.modType, filters.sortType, callback);
};

SCC.releaseSCC = function(socket, data, callback) {
	dataProvider.releaseSCC(data, callback);
};

SCC.modifySCCNum = function(socket, data, callback) {
	dataProvider.modifySCCNum(data, callback);
};

SCC.rejectSCC = function(socket, data, callback) {
	dataProvider.rejectSCC(data, callback);
};

SCC.restoreSCC = function(socket, id, callback) {
	dataProvider.restoreSCC(id, callback);
};