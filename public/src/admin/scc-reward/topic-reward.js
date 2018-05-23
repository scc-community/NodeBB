'use strict';

define('admin/scc-reward/topic-reward', ['translator', 'benchpress'], function (translator, Benchpress) {
	var TopicReward = {};
	TopicReward.init = function () {
		function getSelected() {
			var topicRewards = [];
			$('.topicrewards-table [component="topicreward/select/single"]').each(function () {
				if ($(this).is(':checked')) {
					topicRewards.push(JSON.parse($(this).attr('data-value')));
				}
			});
			return topicRewards;
		}

		function update(className, state) {
			$('.topicrewards-table [component="topicreward/select/single"]:checked').parents('.topicreward-row').find(className).each(function () {
				$(this).toggleClass('hidden', !state);
			});
		}

		function unselectAll() {
			$('.topicrewards-table [component="topicreward/select/single"]').prop('checked', false);
			$('.topicrewards-table [component="topicreward/select/all"]').prop('checked', false);
		}

		function removeSelected() {
			$('.topicrewards-table [component="topicreward/select/single"]:checked').parents('.topicreward-row').remove();
		}

		function done(successMessage, className, flag) {
			return function (err) {
				if (err) {
					return app.alertError(err.message);
				}
				app.alertSuccess(successMessage);
				// if (className) {
				// 	update(className, flag);
				// }
				// unselectAll();
				ajaxify.refresh();
			};
		}

		$('[component="topicreward/select/all"]').on('click', function () {
			if ($(this).is(':checked')) {
				$('.topicrewards-table [component="topicreward/select/single"]').prop('checked', true);
			} else {
				$('.topicrewards-table [component="topicreward/select/single"]').prop('checked', false);
			}
		});

		function getQuery() {
			var result = config.relative_path + '/admin/scc-reward/topic-reward?';
			var dataValue = {
				filterByStatus: $('.statuses button').attr('data-value'),
				filterByRewardType: $('.rewardtype button').attr('data-value'),
				filterByModifyStatus: $('.modifystatus button').attr('data-value'),
				orderByIssueScc: $('.rewardorder button').attr('data-value'),
			};
			for (var key in dataValue) {
				if (dataValue.hasOwnProperty(key)) {
					if (dataValue[key]) {
						result += (key + '=' + dataValue[key] + '&');
					}
				}
			}
			result = result.substring(0, result.length - 1);
			return result;
		}

		function bindConditionMenu(className) {
			$(className).on('click', 'a', function () {
				$(className + ' button').attr('data-value', $(this).attr('data-value'));
				ajaxify.go(getQuery());
			});
		}

		['.statuses', '.rewardtype', '.modifystatus', '.rewardorder'].forEach(function (value) {
			bindConditionMenu(value);
		});

		$('.calc-reward').on('click', function () {
			bootbox.confirm('[[admin/scc-reward/topic-reward:alerts.confirm-calc-reward]]', function (confirm) {
				if (confirm) {
					var data = {
						publish_uid: app.user.uid,
					};
					socket.emit('admin.sccReward.topicReward.buildTopicsReward', data, function (err) {
						if (err) {
							app.alertError(err.message);
							return false;
						}
						ajaxify.refresh();
						app.alertSuccess('[[admin/scc-reward/topic-reward:alerts.confirm-calc-finsih]]');
					});
				}
			});
		});

		$('.send-reward').on('click', function () {
			var topicRewards = getSelected();
			if (!topicRewards.length) {
				app.alertError('[[admin/scc-reward/topic-reward:errors.no-reward-selected]]');
				return false; // specifically to keep the menu open
			}
			Benchpress.parse('admin/partials/scc-reward/topic_send_reward_modal', {}, function (html) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/scc-reward/topic-reward:dialog.title.send-reward]]',
					message: html,
					show: true,
					buttons: {
						close: {
							label: '[[global:close]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/scc-reward/topic-reward:alerts.confirm-send-reward-x, ' + topicRewards.length + ']]',
							callback: function () {
								var errorEl = $('#create-modal-error');
								var maxLength = 40;
								if ($('#memo').val().trim().length > maxLength) {
									errorEl.translateHtml('[[admin/scc-reward/topic-reward:alerts.memo.explanation,' + maxLength + ']]').removeClass('hide');
									return false;
								}
								var formData = $('.ban-modal form').serializeArray().reduce(function (data, cur) {
									data[cur.name] = cur.value;
									return data;
								}, {});
								socket.emit('admin.sccReward.topicReward.sendReward', {
									publish_uid: app.user.uid,
									topicRewards: topicRewards,
									memo: formData.memo,
								}, function (err) {
									if (err) {
										app.alertError(err.message);
									} else {
										app.alertSuccess('[[admin/scc-reward/topic-reward:alerts.send-reward-success]]');
										removeSelected();
										unselectAll();
									}
								});
							},
						},
					},
				});
			});
		});

		$('.remove-reward').on('click', function () {
			var topicRewards = [];
			getSelected().forEach(function (item) {
				var topicReward = {
					id: item.id,
					status: item.status,
				};
				topicRewards.push(topicReward);
			});

			if (!topicRewards.length) {
				app.alertError('[[admin/scc-reward/topic-reward:errors.no-reward-selected]]');
				return false; // specifically to keep the menu open
			}
			Benchpress.parse('admin/partials/scc-reward/topic_remove_reward_modal', {}, function (html) {
				var dialog = bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/scc-reward/topic-reward:dialog.title.modify-reward]]',
					message: html,
					show: true,
					buttons: {
						close: {
							label: '[[global:close]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/scc-reward/topic-reward:alerts.confirm-modify-reward-x, ' + topicRewards.length + ']]',
							callback: function () {
								var errorEl = $('#create-modal-error');
								var maxLength = 40;
								if ($('#memo').val().trim().length > maxLength) {
									errorEl.translateHtml('[[admin/scc-reward/topic-reward:alerts.memo.explanation,' + maxLength + ']]').removeClass('hide');
									return false;
								}
								var formData = $('.ban-modal form').serializeArray().reduce(function (data, cur) {
									data[cur.name] = cur.value;
									return data;
								}, {});
								socket.emit('admin.sccReward.topicReward.removeReward', {
									topicRewards: topicRewards,
									memo: formData.memo,
								}, function (err) {
									if (err) {
										app.alertError(err.message);
									} else {
										app.alertSuccess('[[admin/scc-reward/topic-reward:alerts.remove-reward-success]]');
										removeSelected();
										unselectAll();
									}
								});
							},
						},
					},
				});
				dialog.init(function () {
					var bindEvent = function (className) {
						$(className).on('click', function () {
							$('#memo').val($(className).text());
							$('#reason button').each(function () {
								$(this).removeClass('btn-primary');
							});
							$(this).addClass('btn-primary');
						});
					};
					['#reason1', '#reason2', '#reason3', '#reason4'].forEach(function (className) {
						bindEvent(className);
					});
				});
			});
		});

		$('.restore-reward').on('click', function () {
			var topicRewards = [];
			getSelected().forEach(function (item) {
				var topicReward = {
					id: item.id,
					status: item.status,
					scc_autoed: item.scc_autoed,
				};
				topicRewards.push(topicReward);
			});

			if (!topicRewards.length) {
				app.alertError('[[admin/scc-reward/topic-reward:errors.no-reward-selected]]');
				return false; // specifically to keep the menu open
			}
			Benchpress.parse('admin/partials/scc-reward/topic_restore_reward_modal', {}, function (html) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/scc-reward/topic-reward:dialog.title.restore-reward]]',
					message: html,
					show: true,
					buttons: {
						close: {
							label: '[[global:close]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/scc-reward/topic-reward:alerts.confirm-restore-reward-x, ' + topicRewards.length + ']]',
							callback: function () {
								socket.emit('admin.sccReward.topicReward.restoreReward', {
									topicRewards: topicRewards,
								}, done('[[admin/scc-reward/topic-reward:alerts.restore-reward-success]]', '.modify', true));
							},
						},
					},
				});
			});
		});

		$('.modify-reward').on('click', function () {
			var topicRewards = [];
			getSelected().forEach(function (item) {
				var topicReward = {
					id: item.id,
					status: item.status,
				};
				topicRewards.push(topicReward);
			});

			if (!topicRewards.length) {
				app.alertError('[[admin/scc-reward/topic-reward:errors.no-reward-selected]]');
				return false; // specifically to keep the menu open
			}
			Benchpress.parse('admin/partials/scc-reward/topic_modify_reward_modal', {}, function (html) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/scc-reward/topic-reward:dialog.title.modify-reward]]',
					message: html,
					show: true,
					buttons: {
						close: {
							label: '[[global:close]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/scc-reward/topic-reward:alerts.confirm-modify-reward-x, ' + topicRewards.length + ']]',
							callback: function () {
								var errorEl = $('#create-modal-error');
								var maxLength = 40;
								if ($('#memo').val().trim().length > maxLength) {
									errorEl.translateHtml('[[admin/scc-reward/topic-reward:alerts.memo.explanation,' + maxLength + ']]').removeClass('hide');
									return false;
								}
								var formData = $('.ban-modal form').serializeArray().reduce(function (data, cur) {
									data[cur.name] = cur.value;
									return data;
								}, {});
								socket.emit('admin.sccReward.topicReward.modifyReward', {
									topicRewards: topicRewards,
									memo: formData.memo,
									scc: formData.scc,
								}, done('[[admin/scc-reward/topic-reward:alerts.modify-reward-success]]', '.modify', true));
							},
						},
					},
				});
			});
		});
	};
	return TopicReward;
});
