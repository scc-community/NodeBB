'use strict';

var css = require('./css');

function load(data) {
	var code = css(data);
	code = code.replace(/\\/g, '\\\\').replace(/ß'/g, '\\\'');
	code = 'define(\'' + data.uri + '\',[], function(){seajs.importStyle(\'' + code + '\');});';
	return code;
}

module.exports = load;
