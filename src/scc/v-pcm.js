'use strict';

var Base = require('./base');
var util = require('util');

var Vpcm = function () {
	this.tableName = 'v_pcm';
};
util.inherits(Vpcm, Base);
var vpcm = new Vpcm();

module.exports = vpcm;

