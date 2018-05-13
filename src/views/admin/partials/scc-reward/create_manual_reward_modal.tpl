<div class="alert alert-danger hide" id="create-modal-error"></div>
<form>
	<div class="form-group hidden">
		<label for="group-name">UID</label>
		<input type="text" class="form-control" id="create-manualreward-uid"/>
	</div>
	<div class="form-group">
		<label for="group-name">用户</label>
		<input type="text" class="form-control" id="create-manualreward-username" placeholder="搜索用户" />
	</div>
	<div class="form-group">
		<label for="group-name">奖励数量</label>
		<input type="text" class="form-control" id="create-manualreward-scc_setted" placeholder="SCC" />
	</div>
	<div class="form-group">
		<label for="group-name">类型</label>
		<select class="form-control" id="create-manualreward-rewardtype" >
			<!-- BEGIN allrewardtypes -->
			<option value="{allrewardtypes.value}" <!-- IF allrewardtypes.selected -->selected<!-- ENDIF allrewardtypes.selected -->>{allrewardtypes.text}</option>
			<!-- END allrewardtypes -->
		</select>
	</div>
	<div class="form-group">
		<label for="group-name">内容</label>
		<input type="text" class="form-control" id="create-manualreward-content" placeholder="内容" />
	</div>

	<div class="form-group">
		<label for="group-name">备注</label>
		<input type="text" class="form-control" id="create-manualreward-memo" placeholder="备注" />
	</div>
</form>
