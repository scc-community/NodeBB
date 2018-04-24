'use strict';

var path = require('path');
var util = require('./util');

/**
 * 处理url
 * @param  {string} req    请求
 * @param  {object} config 配置文件
 * @return {object}
 */
module.exports = function (req, config) {
	var data = {};
	var	index;
	var Prefix;

	// 查找时间缀
	var url = req.url.replace('??', '@@');
	index = url.lastIndexOf('?');
	if (index > -1) {
		data.type = util.queryUrl('type', url.slice(index));
		url = url.substr(0, index);
	}

	// 默认类型
	if (data.type !== 'js' && data.type !== 'css') {
		data.type = 'js';
	}

	// 计算位置
	index = url.indexOf('@@');

	// 得到路径前缀
	Prefix = url.substr(0, index) || '';

	// 如果不是以/结尾,但这里要判断如果为空
	if (Prefix && Prefix.slice(-1) !== '/') {
		Prefix += '/';
	}

	// 路径前缀
	data.prefix = Prefix;

	// 文件url数组
	data.urls = [];
	url.substr(index + 2).split(',').forEach(function (val) {
		var ext;
		var uri;

		if (!val) {
			return;
		}

		// 取扩展名
		ext = path.extname(val);

		// 如果没有后缀则使用默认
		if (!ext) {
			ext = data.type;
			val += '.' + ext;
		} else {
			ext = ext.slice(1);
			// 如果非法
			if (['js', 'css', 'tpl'].indexOf(ext) === -1) {
				return;
			}
		}

		// 生成cmd使用uri
		uri = val[0] === '/' ? val.substr(1) : val;
		// 只对js替换
		if (ext === 'js') {
			uri = uri.replace('.js', '');
		}

		// 拼数据
		data.urls[data.urls.length] = {
			url: req.protocol + '://' + req.headers.host + '/' + uri + '.' + ext,
			// path: path.resolve(config.base, val[0] === '/' ? val.substr(1) : Prefix + val), // 全路径
			uri: uri,
			ext: ext, // 扩展名
			parse: data.type === ext && ext === 'js' ? 'js' : data.type === 'js' && ext === 'css' ? 'css_js' : data.type === 'js' && ext === 'tpl' ? 'tpl_js' : data.type === ext && ext === 'css' ? 'css' : 'js',
		};
	});

	return data;
};
