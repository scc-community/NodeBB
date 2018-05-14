'use strict';


define('admin/scc-reward/manual-reward', ['translator', 'benchpress', 'autocomplete'], function (translator, Benchpress, autocomplete) {
	var ManualReward = {};

	ManualReward.init = function () {
		function handleManualrewardCreate() {
			$('#createManualReward').on('click', function () {
				socket.emit('admin.sccReward.manualReward.getAllRewardTypes', function (data) {
					Benchpress.parse('admin/partials/scc-reward/create_manual_reward_modal', data, function (html) {
						var dialog = bootbox.dialog({
							message: html,
							title: '创建奖励',
							onEscape: true,
							buttons: {
								cancel: {
									label: '[[admin/manage/users:alerts.button-cancel]]',
									className: 'btn-link',
								},
								create: {
									label: '[[admin/manage/users:alerts.button-create]]',
									className: 'btn-primary',
									callback: function () {
										createManualreward.call(this);
										return false;
									},
								},
							},
						});
						dialog.init(function () {
							autocomplete.user($('#create-manualreward-username'), function (ev, ui) {
								$('#create-manualreward-uid').val(ui.item.user.uid);
							});
						});
					});
				});
			});
		}

		function checkManualReward(manualReward) {
			var err = null;
			if (manualReward.publish_uid === null) {
				err = {
					message: '需要重新登录',
				};
			} else if (manualReward.uid === null || manualReward.uid.trim() === '') {
				err = {
					message: '用户不存在',
				};
			} else if (manualReward.scc_setted === null || manualReward.scc_setted.trim() === '' || isNaN(manualReward.scc_setted)) {
				err = {
					message: 'SCC奖励不合法',
				};
			} else if (manualReward.content === null || manualReward.content.trim() === '') {
				err = {
					message: '内容不能为空',
				};
			}
			return err;
		}

		function createManualreward() {
			var modal = this;
			var errorEl = $('#create-modal-error');
			var manualReward = {
				uid: document.getElementById('create-manualreward-uid').value,
				publish_uid: app.user.uid,
				scc_setted: document.getElementById('create-manualreward-scc_setted').value,
				reward_type: document.getElementById('create-manualreward-rewardtype').value,
				content: document.getElementById('create-manualreward-content').value,
				memo: document.getElementById('create-manualreward-memo').value,
			};

			var err = checkManualReward(manualReward);
			if (err) {
				return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
			}
			socket.emit('admin.sccReward.manualReward.createManualRewardWithTxs', manualReward, function (err) {
				if (err) {
					return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
				}
				modal.modal('hide');
				modal.on('hidden.bs.modal', function () {
					ajaxify.refresh();
				});
				app.alertSuccess('奖励已创建!');
			});
		}
		handleManualrewardCreate();
	};

	return ManualReward;
});
