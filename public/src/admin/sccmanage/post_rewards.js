'use strict';


define('admin/sccmanage/post_rewards', ['translator', 'benchpress'], function (translator, Benchpress) {
	var PostRewards = {};
	var recordsFilter = {
		postType: 1, //1 全部， 2， 原创， 3， 转发， 4， 翻译
		modType: 1, //1 全部， 2， 是， 3， 否
		sortType: 1 // 1 for desc, 2 for asc
	};

	var userData = {Page: {isUnvested: true, isRejected: false, isReleased: false}, Data: {isEmpty: false}};
    var rejectReason = 0;

	PostRewards.init = function() {
		//Click event, when use clicked one of the filter drop box
		selectDropDown();

		//Once user clicked "select all" or unselect all checkbox
		toggleCheckbox();

		//Clicked released button
		releaseSCC();

		//Event for clicked operation hyperlinks
		clickedOperateButtons();

		//Page initialze

		//Bind modal event
		bindModalEvent();

	};

	function bindModalEvent() {
		//Bind reject modal event

		$("body").on("click", ".btn-reject-reason", function(e) {
			e.preventDefault();

			if(! $(this).hasClass("btn-primary")) {
				$(this).addClass("btn-primary");
			}

			$(this).siblings("a").removeClass("btn-primary");
			rejectReason = $(this).data("value");
		});
	}

	function clickedOperateButtons() {
		$("#scc-mgr-ajax-datazone").on("click", ".scc-mgr-op-action", function() {
			switch($(this).data("value")) {
				case "mod":
					modifyNum($(this).data("id"));
					break;
				case "reject":
					rejectSCC($(this).data("id"));
					break;
				case "restore":
					restoreSCC($(this).data("id"));
					break;
				default:
					break;
			}
		});
	}

	function modifyNum(id) {
		Benchpress.parse('admin/partials/sccmanage/post_submit_modal', {}, function (html) {
			translator.translate(html, function (htm) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/sccmanage/postrewards:modal/release_title]]',
					message: htm,
					show: true,
					buttons: {
						close: {
							label: '[[admin/sccmanage/postrewards:modal/cancel]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/sccmanage/postrewards:modal/confirm]]',
							callback: function () {
								var formData = $('.mod-scc-modal form').serializeArray().reduce(function (data, cur) {
									data[cur.name] = cur.value;
									return data;
								}, {});
								formData.Id = id;
								//console.log(JSON.stringify(formData));

								socket.emit('admin.post_rewards.modifySCCNum', formData, function(err, data) {

								});
							},
						},
					}
				});
			});
		});
	}

	function rejectSCC(id) {
		Benchpress.parse('admin/partials/sccmanage/post_reject_modal', {}, function (html) {
			translator.translate(html, function (htm) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[admin/sccmanage/postrewards:modal/reject_title]]',
					message: htm,
					show: true,
					buttons: {
						close: {
							label: '[[admin/sccmanage/postrewards:modal/cancel]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/sccmanage/postrewards:modal/confirm]]',
							callback: function () {
								var formData = {};
								formData.Id = id;
								formData.reason = rejectReason;

								socket.emit('admin.post_rewards.rejectSCC', formData, function (err, data) {

								});
							},
						},
					}
				});
			});
		});
	}

	//Restore SCC for ID
	function restoreSCC(id) {
		socket.emit('admin.post_rewards.restoreSCC', id, function (err, data) {
			if(data.code == 0) {
				app.alertSuccess("Restore successfully.");
				window.location.reload();
			}
		});
	}

	function releaseSCC() {

		//Show modal
		$("#scc-mgr-ajax-datazone").on("click", "#scc-mgr-btn-submit", function() {
			var _selectedPostScc = getSelectedPosts();
            if (_selectedPostScc.records.length == 0) {
            	app.alertError("At least one checkbox should be checked!");
            	return;
			}

			bootbox.dialog({
					message: '[[admin/sccmanage/postrewards:modal/release_content, ' + _selectedPostScc.totalSCC + ',' + _selectedPostScc.users.length + ']]',
					title: '[[admin/sccmanage/postrewards:modal/release_title]]',
					onEscape: true,
					buttons: {
						cancel: {
							label: '[[admin/sccmanage/postrewards:modal/cancel]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/sccmanage/postrewards:modal/confirm]]',
							className: 'btn-primary',
							callback: function () {
								socket.emit('admin.post_rewards.releaseSCC', _selectedPostScc, function(err, data) {
									if(data.code == 0) {
										window.location.reload();
									} else {
										app.alertError("Release SCC failed.");
									}

								});
								return false;
							},
						},
					},
				});
			});
	}

	function getSelectedPosts() {
		var _info = {
			totalSCC: 0,
			records: [],
			users: []
		};

		$("#scc-mgr-ajax-datazone :input:checkbox[name=RewardId]:checked").each(function (indx, element) {
			   var _uid = $(element).siblings(":input[name=scc-uid]").val() || 0;
			   var _scc = $(element).siblings(":input[name=scc-count]").val() || 0;

				_info.records.push(
					{
						id: $(element).val(),
						uid: _uid,
						scc: _scc
					}
				);

				_info.totalSCC +=  parseInt(_scc);

				if(_info.users.indexOf(_uid) == -1) {
					_info.users.push(_uid);
				}
		});

		return _info;
	}

	function selectDropDown() {
		$(".dropdown-item").on('click', function (e) {
			e.preventDefault();
			$(this).parent().parent().siblings("button").children("span:first").text($(this).text());
			$(this).parent().parent().siblings("button").children("span:hidden").text($(this).data("value"));
			refreshFilters();
			//reload page
			socket.emit('admin.post_rewards.getUnvested', recordsFilter, function(err, data) {
				if(err != null) {
					userData.Data.isEmpty = true;
					userData.Data.records = [];
				} else {
					userData.Data.isEmpty = data.unvested.records.length > 1 ? false : true;
					userData.Data.records = data.unvested.records;
				}

				//Refresh page
				Benchpress.parse("admin/partials/sccmanage/post_rewards_table", userData, function(html) {
					translator.translate(html, function (html) {
						$("#scc-mgr-ajax-datazone").html(html);
					});

				});
			});
		});
	}

	function refreshFilters() {
		recordsFilter.postType = $("#filter-post-type").text();
		recordsFilter.modType =  $("#filter-post-mod").text();
		recordsFilter.sortType = $("#filter-post-order").text();
	}

	function toggleCheckbox() {
		$("#scc-mgr-ajax-datazone").on("click", "#scc-mgr-tbl-checkall", function(event) {
			var checkBoxes = $("input[name=RewardId]");
			checkBoxes.prop("checked", $(this).prop("checked"));
		});
	}

	return PostRewards;
});