$(document).delegate("#event", "click", function() {
  var id = $(this).data("id"),
      channel = $(this).data("channel"),
      timezone = new Date().getTimezoneOffset() * 60000;

  $.post("/schedule/event/prepare", {
    id: id,
    channel: channel,
    timezone: timezone
  }, function(data) {
    if (data.message == "success") {
      window.location.replace("/schedule/stream/new/");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
