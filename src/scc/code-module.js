'use strict';

var Base = require('./base');
var util = require('util');

var CodeModule = function () {
	this.tableName = 'code_modules';
};
util.inherits(CodeModule, Base);
var codeModule = new CodeModule();

module.exports = codeModule;
