'use strict';

var tableModels = [
	{
		name: 'users',
		idFieldName: 'id',
	},
];
var schema = module.exports;

schema.init = function (mysqlClient) {
	schema.initModeal(mysqlClient);
};

schema.initModeal = function (mysqlClient) {
	tableModels.forEach(function (model) {
		mysqlClient.add(model);
	});
};

