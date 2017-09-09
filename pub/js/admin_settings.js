$(document).delegate("#logs, #search, #verify", "change", function() {
  var logs = $("#logs").is(":checked"),
      search = $("#search").is(":checked"),
      verify = $("#verify").is(":checked");

  $.post("/admin/settings/update", {
    logs: logs,
    search: search,
    verify: verify
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The settings were updated successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
