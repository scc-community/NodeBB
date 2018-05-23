<div class="alert alert-danger hide" id="create-modal-error"></div>
<form>
	<div class="form-group hidden">
		<label for="group-name">UID</label>
		<input type="text" class="form-control" id="create-manualreward-uid"/>
	</div>
	<div class="form-group">
		<label for="group-name">[[admin/scc-reward/manual-reward:title.username]]</label>
		<input type="text" class="form-control" id="create-manualreward-username" placeholder="[[admin/scc-reward/manual-reward:input.search-user]]" />
	</div>
	<div class="form-group">
		<label for="group-name">[[admin/scc-reward/manual-reward:title.reward-scc]]</label>
		<input type="text" class="form-control" id="create-manualreward-scc_setted" placeholder="SCC" />
	</div>
	<div class="form-group">
		<label for="group-name">[[admin/scc-reward/manual-reward:title.reward-type]]</label>
		<select class="form-control" id="create-manualreward-rewardtype" >
			<!-- BEGIN allrewardtypes -->
			<option value="{allrewardtypes.value}" <!-- IF allrewardtypes.selected -->selected<!-- ENDIF allrewardtypes.selected -->>{allrewardtypes.text}</option>
			<!-- END allrewardtypes -->
		</select>
	</div>
	<div class="form-group">
		<label for="group-name">[[admin/scc-reward/manual-reward:title.reward-content]]</label>
		<input type="text" class="form-control" id="create-manualreward-content" placeholder="[[admin/scc-reward/manual-reward:title.reward-content]]" />
	</div>

	<div class="form-group">
		<label for="group-name">[[admin/scc-reward/manual-reward:title.reward-memo]]</label>
		<input type="text" class="form-control" id="create-manualreward-memo" placeholder="[[admin/scc-reward/manual-reward:title.reward-memo]]" />
	</div>
</form>
