'use strict';

var util = {};

var fs = require('fs');
var path = require('path');


util.queryUrl = function (name, url) {
	var results;
	var params;
	var qrs2;
	var i;
	var len;

	if (typeof (url) !== 'string') {
		return '';
	}

	if (url[0] === '?') {
		url = url.substr(1);
	}

	if (name) {
		results = url.match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'));
		results = results === null ? '' : decodeURIComponent(results[2]);
	} else {
		results = {};
		if (url) {
			params = url.split('&');
			i = 0;
			len = params.length;
			for (i = 0; i < len; i++) {
				qrs2 = params[i].split('=');
				results[qrs2[0]] = (qrs2[1] === undefined ? '' : decodeURIComponent(qrs2[1]));
			}
		}
	}
	return results;
};

/**
 * 递归创建目录
 * @thinkjs
 */
util.mkdir = function (p, mode) {
	var pp;

	mode = mode || '0777';

	if (fs.existsSync(p)) {
		util.chmod(p, mode);
		return true;
	}
	pp = path.dirname(p);
	if (fs.existsSync(pp)) {
		fs.mkdirSync(p, mode);
	} else {
		util.mkdir(pp, mode);
		util.mkdir(p, mode);
	}
	return true;
};


/**
 * 设置文件权限
 * @thinkjs
 */
util.chmod = function (p, mode) {
	mode = mode || '0777';

	if (!fs.existsSync(p)) {
		return true;
	}
	return fs.chmodSync(p, mode);
};

module.exports = util;
