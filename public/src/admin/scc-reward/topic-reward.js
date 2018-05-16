'use strict';


define('admin/scc-reward/topic-reward', ['translator', 'benchpress'], function (translator, Benchpress) {
	var TopicReward = {};
	var recordsFilter = {
		topicType: "all", // 1 全部， 2， 原创， 3， 转发， 4， 翻译
		modType: 1, // 1 全部， 2， 是， 3， 否
		sortType: 1, // 1 for desc, 2 for asc
		pageNo: 1,
		pageSize: 30, //default
	};

	var userData = { Page: { isUnvested: true, isRejected: false, isReleased: false }, Data: { isEmpty: false } };
	var rejectReason = 0;

	TopicReward.init = function () {
		// Click event, when use clicked one of the filter drop box
		selectDropDown();

		// Once user clicked "select all" or unselect all checkbox
		toggleCheckbox();

		// Clicked released button
		releaseSCC();

		// Event for clicked operation hyperlinks
		clickedOperateButtons();

		// Page initialze

		// Bind modal event
		bindModalEvent();
	};

	function bindModalEvent() {
		// Bind reject modal event

		$('body').on('click', '.btn-reject-reason', function (e) {
			e.preventDefault();

			if (!$(this).hasClass('btn-primary')) {
				$(this).addClass('btn-primary');
			}

			$(this).siblings('a').removeClass('btn-primary');
			rejectReason = $(this).data('value');
		});
	}

	function clickedOperateButtons() {
		$('#scc-mgr-ajax-datazone').on('click', '.scc-mgr-op-action', function () {
			switch ($(this).data('value')) {
			case 'mod':
				modifyNum($(this).data('id'));
				break;
			case 'reject':
				rejectSCC($(this).data('id'));
				break;
			case 'restore':
				restoreSCC($(this).data('id'));
				break;
			default:
				break;
			}
		});
	}

	function modifyNum(id) {
		Benchpress.parse('admin/partials/scc-reward/topic_submit_modal', {}, function (html) {
			translator.translate(html, function (htm) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/scc-reward/topic-reward:modal/release_title]]',
					message: htm,
					show: true,
					buttons: {
						close: {
							label: '[[admin/scc-reward/topic-reward:modal/cancel]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/scc-reward/topic-reward:modal/confirm]]',
							callback: function () {
								var formData = $('.mod-scc-modal form').serializeArray().reduce(function (data, cur) {
									data[cur.name] = cur.value;
									return data;
								}, {});
								formData.Id = id;
								// console.log(JSON.stringify(formData));

								socket.emit('admin.sccReward.topicReward.modifySCCNum', formData, function (err, data) {
									console.log(err, data);
								});
							},
						},
					},
				});
			});
		});
	}

	function rejectSCC(id) {
		Benchpress.parse('admin/partials/scc-reward/topic_reject_modal', {}, function (html) {
			translator.translate(html, function (htm) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/scc-reward/topic-reward:modal/reject_title]]',
					message: htm,
					show: true,
					buttons: {
						close: {
							label: '[[admin/scc-reward/topic-reward:modal/cancel]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/scc-reward/topic-reward:modal/confirm]]',
							callback: function () {
								var formData = {};
								formData.Id = id;
								formData.reason = rejectReason;

								socket.emit('admin.sccReward.topicReward.rejectSCC', formData, function (err, data) {
									console.log(err, data);
								});
							},
						},
					},
				});
			});
		});
	}

	// Restore SCC for ID
	function restoreSCC(id) {
		socket.emit('admin.sccReward.topicReward.restoreSCC', id, function (err, data) {
			console.log(err, data);
			if (data.code === 0) {
				app.alertSuccess('Restore successfully.');
				window.location.reload();
			}
		});
	}

	function releaseSCC() {
		// Show modal
		$('#scc-mgr-ajax-datazone').on('click', '#scc-mgr-btn-submit', function () {
			var _selectedTopicScc = getSelectedTopics();
			if (_selectedTopicScc.records.length === 0) {
				app.alertError('At least one checkbox should be checked!');
				return;
			}

			bootbox.dialog({
				message: '[[admin/scc-reward/topic-reward:modal/release_content, ' + _selectedTopicScc.totalSCC + ',' + _selectedTopicScc.users.length + ']]',
				title: '[[admin/scc-reward/topic-reward:modal/release_title]]',
				onEscape: true,
				buttons: {
					cancel: {
						label: '[[admin/scc-reward/topic-reward:modal/cancel]]',
						className: 'btn-link',
					},
					submit: {
						label: '[[admin/scc-reward/topic-reward:modal/confirm]]',
						className: 'btn-primary',
						callback: function () {
							socket.emit('admin.sccReward.topicReward.releaseSCC', _selectedTopicScc, function (err, data) {
								console.log(err, data);
								if (data.code === 0) {
									window.location.reload();
								} else {
									app.alertError('Release SCC failed.');
								}
							});
							return false;
						},
					},
				},
			});
		});
	}

	function getSelectedTopics() {
		var _info = {
			totalSCC: 0,
			records: [],
			users: [],
		};

		$('#scc-mgr-ajax-datazone :input:checkbox[name=RewardId]:checked').each(function (indx, element) {
			var _uid = $(element).siblings(':input[name=scc-uid]').val() || 0;
			var _scc = $(element).siblings(':input[name=scc-count]').val() || 0;

			_info.records.push(
				{
					id: $(element).val(),
					uid: _uid,
					scc_setted: _scc,
					scc_issued: _scc,
				}
			);

			_info.totalSCC += parseInt(_scc, 10);

			if (_info.users.indexOf(_uid) === -1) {
				_info.users.push(_uid);
			}
		});

		return _info;
	}

	function selectDropDown() {
		$('.dropdown-item').on('click', function (e) {
			e.preventDefault();
			$(this).parent().parent().siblings('button').children('span:first').text($(this).text());
			$(this).parent().parent().siblings('button').children('span:hidden').text($(this).data('value'));
			refreshFilters();
			// reload page
			socket.emit('admin.sccReward.topicReward.getUnvested', recordsFilter, function (err, data) {
				if (err != null) {
					userData.Data.isEmpty = true;
					userData.Data.records = [];
				} else {
					userData.Data.isEmpty = !(data && data.length > 1);
					userData.Data.records = data;
				}

				// Refresh page
				Benchpress.parse('admin/partials/scc-reward/topic_reward_table', userData, function (html) {
					translator.translate(html, function (html) {
						$('#scc-mgr-ajax-datazone').html(html);
					});
				});
			});
		});
	}

	function refreshFilters() {
		recordsFilter.topicType = $('#filter-topic-type').text();
		recordsFilter.modType = $('#filter-topic-mod').text();
		recordsFilter.sortType = $('#filter-topic-order').text();
	}

	function toggleCheckbox() {
		$('#scc-mgr-ajax-datazone').on('click', '#scc-mgr-tbl-checkall', function (event) {
			console.log(event);
			var checkBoxes = $('input[name=RewardId]');
			checkBoxes.prop('checked', $(this).prop('checked'));
		});
	}

	return TopicReward;
});
