$(document).delegate("#search", "click", function() {
  var reddit = $("#search-reddit-username").val(),
      twitch = $("#search-twitch-username").val(),
      title = $("#search-title").val(),
      type = $("#search-type select").val(),
      status = $("#search-status select").val();

  if (reddit || twitch || title || type || status) {
    $.post("/admin/requests/get", {
      reddit: reddit,
      twitch: twitch,
      title: title,
      type: type,
      status: status
    }, function(data) {
      if (data.message == "not_found") {
        Materialize.toast("There were no results found.", 4000, "rounded");
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
      }
      else if (data.message == "unknown") {
        Materialize.toast("An unknown error occurred.", 4000, "rounded");
      }
      else {
        $("#search-data").slideUp("fast", function() {
          $("#search-data").html(data);
          $("#search-data").slideDown("fast");
        });
      }
    });
  }
  else {
    Materialize.toast("You have not filled in any search fields.", 4000, "rounded");
  }
});

$(document).ready(function() {
  if ($("#tab-pending>.col").html().trim() == "") {
    $.post("/missing/", {
      message: "There are no pending advertisement requests."
    }, function(data) {
      $("#tab-pending>.col").html(data);
      $("#tab-pending>.col").attr("style", "");
    });
  }
});
