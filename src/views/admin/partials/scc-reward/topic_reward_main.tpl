
<div class="row">
    <i class="fa fa-btc fa-2x" aria-hidden="true"></i> <strong>SCC[[admin/scc-reward/topic-reward:rewards]]</strong>
    <hr class="divider" />
</div>

<div class="row" style="margin-bottom: 15px;">
   <div class="col-lg-6 col-xs-12">
            <div class="btn-group">
               <button type="button" class="btn btn-default btn-primary scc-mgr-btn scc-mgr-btn-reward" data-value="1">[[admin/scc-reward/topic-reward:rewards]]</button>
           </div>
        <!-- IF Page.isUnvested -->
                <div class="btn-group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="scc-mgr-filter-art" class="scc-mgr-dropdown-title">[[admin/scc-reward/topic-reward:type]]</span>
                    <span style="display:none" id="filter-topic-type">1</span>
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                        <li> [[admin/scc-reward/topic-reward:type]] </li>
                        <li class="divider"></li>
                        <li> <a href="#" class="dropdown-item" data-value="1">[[admin/scc-reward/topic-reward:all]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="2">[[admin/scc-reward/topic-reward:original]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="3">[[admin/scc-reward/topic-reward:forwarded]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="4">[[admin/scc-reward/topic-reward:translate]]</a></li>
                  </ul>
                </div>

               <div class="btn-group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="scc-mgr-filter-mod">[[admin/scc-reward/topic-reward:modified]]</span><span class="caret"></span>
                    <span style="display:none" id="filter-topic-mod">1</span>
                  </button>
                  <ul class="dropdown-menu">
                        <li> [[admin/scc-reward/topic-reward:modified]] </li>
                        <li class="divider"></li>
                        <li> <a href="#" class="dropdown-item" data-value="1">[[admin/scc-reward/topic-reward:all]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="2">[[admin/scc-reward/topic-reward:yes]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="3">[[admin/scc-reward/topic-reward:no]]</a></li>
                  </ul>
                </div>

               <div class="btn-group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="scc-mgr-filter-reward">[[admin/scc-reward/topic-reward:qty]]</span><span class="caret"></span>
                    <span style="display:none" id="filter-topic-order">1</span>
                  </button>
                  <ul class="dropdown-menu">
                        <li> [[admin/scc-reward/topic-reward:qty]] </li>
                        <li class="divider"></li>
                        <li> <a href="#" class="dropdown-item" data-value="1">[[admin/scc-reward/topic-reward:desc]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="2">[[admin/scc-reward/topic-reward:asc]]</a></li>
                  </ul>
              </div>
        <!-- ENDIF Page.isUnvested -->
   </div>


   <div class="col-lg-6 col-xs-12" style="text-align:right">
        <div class="btn-group" role="group" id="toggle-group-2">
          <a type="button" class="btn btn-default <!-- IF Page.isUnvested -->btn-primary <!-- ENDIF Page.isUnvested -->scc-mgr-btn-release" href="/admin/scc-reward/topic-reward">[[admin/scc-reward/topic-reward:unvested]]</a>
          <a type="button" class="btn btn-default <!-- IF Page.isReleased -->btn-primary <!-- ENDIF Page.isReleased -->scc-mgr-btn-release" href="/admin/scc-reward/topic-reward/released">[[admin/scc-reward/topic-reward:released]]</a>
          <a type="button" class="btn btn-default <!-- IF Page.isRejected -->btn-primary <!-- ENDIF Page.isRejected -->scc-mgr-btn-release" href="/admin/scc-reward/topic-reward/rejected">[[admin/scc-reward/topic-reward:reject]]</a>
        </div>
   </div>
</div>

<!-- IF Data.isEmpty -->
<div class="alert alert-warning alert-dismissible" role="alert" style="margin-top: 15px;">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <strong>[[admin/scc-reward/topic-reward:warning]]</strong> [[admin/scc-reward/topic-reward:norecords]]
</div>
<!-- ENDIF Data.isEmpty -->