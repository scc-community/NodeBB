'use strict';


define('forum/account/profile', [
	'forum/account/header',
	'forum/infinitescroll',
	'components',
], function (header, infinitescroll) {
	var Account = {};
	var theirid;

	Account.init = function () {
		header.init();

		theirid = ajaxify.data.theirid;

		app.enterRoom('user/' + theirid);

		processPage();

		socket.removeListener('event:user_status_change', onUserStatusChange);
		socket.on('event:user_status_change', onUserStatusChange);

		if (!config.usePagination) {
			infinitescroll.init(loadMorePosts);
		}

		var link = $('#invitelink').attr('invitelink');
		if (isMobile()) {
			link += '?mobile=1';
		}
		$('#invitelink').attr('href', link);
	};

	function isMobile() {
		var sUserAgent = navigator.userAgent.toLowerCase();
		var matchValue; var bIsIpad; var bIsIphoneOs; var bIsMidp;	var bIsUc7; var bIsUc; var bIsAndroid; var bIsCE; var bIsWM;
		matchValue = sUserAgent.match(/ipad/i);
		if (matchValue) {
			bIsIpad = matchValue[0] === 'ipad';
		}
		matchValue = sUserAgent.match(/iphone os/i);
		if (matchValue) {
			bIsIphoneOs = matchValue[0] === 'iphone os';
		}
		matchValue = sUserAgent.match(/midp/i);
		if (matchValue) {
			bIsMidp = matchValue[0] === 'midp';
		}
		matchValue = sUserAgent.match(/rv:1.2.3.4/i);
		if (matchValue) {
			bIsUc7 = matchValue[0] === 'rv:1.2.3.4';
		}
		matchValue = sUserAgent.match(/ucweb/i);
		if (matchValue) {
			bIsUc = matchValue[0] === 'ucweb';
		}
		matchValue = sUserAgent.match(/android/i);
		if (matchValue) {
			bIsAndroid = matchValue[0] === 'android';
		}
		matchValue = sUserAgent.match(/windows ce/i);
		if (matchValue) {
			bIsCE = matchValue[0] === 'windows ce';
		}
		matchValue = sUserAgent.match(/windows mobile/i);
		if (matchValue) {
			bIsWM = matchValue[0] === 'windows mobile';
		}

		if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
			return true;
		}
		return false;
	}

	function processPage() {
		$('[component="posts"] img:not(.not-responsive), [component="aboutme"] img:not(.not-responsive)').addClass('img-responsive');
	}

	function onUserStatusChange(data) {
		if (parseInt(ajaxify.data.theirid, 10) !== parseInt(data.uid, 10)) {
			return;
		}

		app.updateUserStatus($('.account [data-uid="' + data.uid + '"] [component="user/status"]'), data.status);
	}

	function loadMorePosts(direction) {
		if (direction < 0 || !$('[component="posts"]').length) {
			return;
		}

		$('[component="posts/loading"]').removeClass('hidden');

		infinitescroll.loadMore('posts.loadMoreUserPosts', {
			after: $('[component="posts"]').attr('data-nextstart'),
			uid: theirid,
		}, function (data, done) {
			if (data.posts && data.posts.length) {
				onPostsLoaded(data.posts, done);
			} else {
				done();
			}
			$('[component="posts"]').attr('data-nextstart', data.nextStart);
			$('[component="posts/loading"]').addClass('hidden');
		});
	}

	function onPostsLoaded(posts, callback) {
		posts = posts.filter(function (post) {
			return !$('[component="posts"] [data-pid=' + post.pid + ']').length;
		});

		if (!posts.length) {
			return callback();
		}

		app.parseAndTranslate('account/profile', 'posts', { posts: posts }, function (html) {
			$('[component="posts"]').append(html);
			html.find('.timeago').timeago();

			callback();
		});
	}

	return Account;
});
