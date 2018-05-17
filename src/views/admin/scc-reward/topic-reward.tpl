<!-- IMPORT admin/partials/scc-reward/topic_reward_main.tpl -->
<div class="row" id="scc-mgr-ajax-datazone">

				<div class="clearfix">
					<div class="btn-group pull-right">
                        <button id="buildReward" class="btn btn-primary pull-left">构建奖励 </button>
						<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">编辑 <span class="caret"></span></button>
						<ul class="dropdown-menu">
							<li><a href="#" class="validate-email"><i class="fa fa-fw fa-key"></i> 修改SCC</a></li>
							<li><a href="#" class="send-validation-email"><i class="fa fa-fw fa-mail-key"></i> 移除奖励</a></li>
							<li><a href="#" class="password-reset-email"><i class="fa fa-fw fa-key"></i> 恢复SCC</a></li>
							<li class="divider"></li>
							<li><a href="#" class="ban-topicreward"><i class="fa fa-fw fa-gavel"></i> 发放</a></li>
						</ul>
					</div>
				</div>

                <div class="col-lg-6 col-xs-12">
                    <div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span id="scc-mgr-filter-art" class="scc-mgr-dropdown-title">文章奖励类型</span>
                            <span style="display:none" id="filter-topic-type">1</span>
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                                <li> <a href="#" class="dropdown-item" data-value="all">全部</a></li>
                                <!-- BEGIN rewardtypes -->
                                <li> <a href="#" class="dropdown-item" data-value="{rewardtypes.text}">{rewardtypes.text}</a></li>
			                    <!-- END rewardtypes -->
                        </ul>
                    </div>
                </div>

				<br />
				<div class="table-responsive">
					<table class="table table-striped topicrewards-table">
						<thead>
							<tr>
								<th><input component="topicreward/select/all" type="checkbox"/></th>
                                <th>[[admin/scc-reward/topic-reward:title]]</th>
                                <th>[[admin/scc-reward/topic-reward:username]]</th>
                                <th>[[admin/scc-reward/topic-reward:type]]</th>
                                <th>[[admin/scc-reward/topic-reward:date]]</th>
                                <th class="text-right">[[admin/scc-reward/topic-reward:word_count]]</th>
                                <th class="text-right">[[admin/scc-reward/topic-reward:upvote_count]]</th>
                                <th class="text-right">[[admin/scc-reward/topic-reward:scc]]</th>
							</tr>
						</thead>
						<tbody>
							<!-- BEGIN topicrewards -->
							<tr class="topicreward-row">
								<th><input component="topic-reward/select/single" data-uid="{topicrewards.uid}" type="checkbox"/></th>
								<td><i class="administrator fa fa-shield text-success"></i><a href="{config.relative_path}/topic/{topicRewards.tid}"> {topicRewards.topic_title}</a></td>
								<td><i class="administrator fa fa-shield text-success"></i><a href="{config.relative_path}/user/{topicRewards.username}"> {topicRewards.username}</a></td>
                                <td class="text-right">{topicrewards.reward_type_text}</td>
								<td class="timeago">{topicrewards.date_issued}</td>
								<td class="text-right">{topicrewards.topic_words_count}</a></td>
								<td class="text-right">{topicrewards.topic_upvotes_count}</td>
								<td><span class="text-right" title="{topicrewards.scc}"></span></td>
							</tr>
							<!-- END topicrewards -->
						</tbody>
					</table>
				</div>

				<!-- IMPORT partials/paginator.tpl -->
			</div>
		</div>
	</div>
</div>

</div>