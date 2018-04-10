'use strict';

var async = require('async');

var db = require('../../database');

module.exports = {
	name: 'New sorted set cid:<cid>:tids:publishtime',
	timestamp: Date.UTC(2018, 4, 9),
	method: function (callback) {
		var progress = this.progress;

		require('../../batch').processSortedSet('topics:tid', function (tids, next) {
			async.eachSeries(tids, function (tid, next) {
				db.getObjectFields('topic:' + tid, ['cid', 'timestamp', 'lastposttime'], function (err, topicData) {
					if (err || !topicData) {
						return next(err);
					}
					progress.incr();

					var timestamp = topicData.timestamp;
					db.sortedSetAdd('cid:' + topicData.cid + ':tids:publishtime', timestamp, tid, next);
				}, next);
			}, next);
		}, {
			progress: this.progress,
		}, callback);
	},
};
