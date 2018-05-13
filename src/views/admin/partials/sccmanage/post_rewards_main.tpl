
<div class="row">
    <i class="fa fa-btc fa-2x" aria-hidden="true"></i> <strong>SCC[[admin/sccmanage/postrewards:rewards]]</strong>
    <hr class="divider" />
</div>

<div class="row" style="margin-bottom: 15px;">
   <div class="col-lg-6 col-xs-12">
            <div class="btn-group">
               <button type="button" class="btn btn-default btn-primary scc-mgr-btn scc-mgr-btn-reward" data-value="1">[[admin/sccmanage/postrewards:rewards]]</button>
           </div>
        <!-- IF Page.isUnvested -->
                <div class="btn-group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="scc-mgr-filter-art" class="scc-mgr-dropdown-title">[[admin/sccmanage/postrewards:type]]</span>
                    <span style="display:none" id="filter-post-type">1</span>
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                        <li> [[admin/sccmanage/postrewards:type]] </li>
                        <li class="divider"></li>
                        <li> <a href="#" class="dropdown-item" data-value="1">[[admin/sccmanage/postrewards:all]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="2">[[admin/sccmanage/postrewards:original]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="3">[[admin/sccmanage/postrewards:forwarded]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="4">[[admin/sccmanage/postrewards:translate]]</a></li>
                  </ul>
                </div>

               <div class="btn-group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="scc-mgr-filter-mod">[[admin/sccmanage/postrewards:modified]]</span><span class="caret"></span>
                    <span style="display:none" id="filter-post-mod">1</span>
                  </button>
                  <ul class="dropdown-menu">
                        <li> [[admin/sccmanage/postrewards:modified]] </li>
                        <li class="divider"></li>
                        <li> <a href="#" class="dropdown-item" data-value="1">[[admin/sccmanage/postrewards:all]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="2">[[admin/sccmanage/postrewards:yes]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="3">[[admin/sccmanage/postrewards:no]]</a></li>
                  </ul>
                </div>

               <div class="btn-group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="scc-mgr-filter-reward">[[admin/sccmanage/postrewards:qty]]</span><span class="caret"></span>
                    <span style="display:none" id="filter-post-order">1</span>
                  </button>
                  <ul class="dropdown-menu">
                        <li> [[admin/sccmanage/postrewards:qty]] </li>
                        <li class="divider"></li>
                        <li> <a href="#" class="dropdown-item" data-value="1">[[admin/sccmanage/postrewards:desc]]</a></li>
                        <li> <a href="#" class="dropdown-item" data-value="2">[[admin/sccmanage/postrewards:asc]]</a></li>
                  </ul>
              </div>
        <!-- ENDIF Page.isUnvested -->
   </div>


   <div class="col-lg-6 col-xs-12" style="text-align:right">
        <div class="btn-group" role="group" id="toggle-group-2">
          <a type="button" class="btn btn-default <!-- IF Page.isUnvested -->btn-primary <!-- ENDIF Page.isUnvested -->scc-mgr-btn-release" href="/admin/sccmanage/post_rewards">[[admin/sccmanage/postrewards:unvested]]</a>
          <a type="button" class="btn btn-default <!-- IF Page.isReleased -->btn-primary <!-- ENDIF Page.isReleased -->scc-mgr-btn-release" href="/admin/sccmanage/post_rewards/released">[[admin/sccmanage/postrewards:released]]</a>
          <a type="button" class="btn btn-default <!-- IF Page.isRejected -->btn-primary <!-- ENDIF Page.isRejected -->scc-mgr-btn-release" href="/admin/sccmanage/post_rewards/rejected">[[admin/sccmanage/postrewards:reject]]</a>
        </div>
   </div>
</div>

<!-- IF Data.isEmpty -->
<div class="alert alert-warning alert-dismissible" role="alert" style="margin-top: 15px;">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <strong>[[admin/sccmanage/postrewards:warning]]</strong> [[admin/sccmanage/postrewards:norecords]]
</div>
<!-- ENDIF Data.isEmpty -->