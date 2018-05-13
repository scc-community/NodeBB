<!-- IMPORT admin/partials/sccmanage/post_rewards_main.tpl -->


<table class="table table-striped table-responsive">
    <thead>
        <tr>
            <th>[[admin/sccmanage/postrewards:title]]</th>
            <th>[[admin/sccmanage/postrewards:author]]</th>
            <th>[[admin/sccmanage/postrewards:reason]]</th>
        </tr>
    </thead>
        <tbody>
        <!-- BEGIN Data.records -->
        <tr>
              <td><a href="/topic/{records.topic_category}/{records.topic_title}">{records.topic_title}</a></td>
              <td><a href="/user/{records.author}">{records.author}</a></td>
              <td>{records.reason}</td>
        </tr>
      <!-- END Data.records -->
    </tbody>
</table>