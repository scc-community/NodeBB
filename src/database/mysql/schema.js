'use strict';

var tableModels = [
	{
		name: 'users',
		idFieldName: 'id',
	},
	{
		name: 'reward_types',
		idFieldName: 'id',
	},
	{
		name: 'topic_rewards',
		idFieldName: 'id',
	},
	{
		name: 'manual_rewards',
		idFieldName: 'id',
	},
	{
		name: 'txs',
		idFieldName: 'id',
	},
	{
		name: 'tx_log',
		idFieldName: 'id',
	},
];
var schema = module.exports;

schema.init = function (mysqlClient) {
	schema.initModel(mysqlClient);
};

schema.initModel = function (mysqlClient) {
	tableModels.forEach(function (model) {
		mysqlClient.add(model);
	});
};

