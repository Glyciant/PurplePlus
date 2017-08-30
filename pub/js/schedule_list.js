$(document).ready(function() {
  var d = new Date(),
  timezone = d.toLocaleString('en', { timeZoneName:'short' }).split(' ').pop();
  $('[id="timezone"]').html(timezone);
  $('[id="start"], [id="end"]').each(function() {
    var d = new Date(parseInt($(this).data("utc")));
    $(this).html(("0" + d.getDate()).slice(-2)  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
  });
});

$(document).delegate("#edit-stream", "click", function() {
  var id = $(this).data("id"),
      timezone = new Date().getTimezoneOffset() * -60000;
  $.post("/schedule/streams/edit", {
    id: id,
    timezone: timezone
  }, function(data) {
    window.location.replace("/schedule/stream/" + id);
  });
});

$(document).delegate("#delete-stream", "click", function() {
  var id = $(this).data("id");
  $.post("/schedule/streams/delete", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      location.reload();
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occured.", 4000, "rounded");
    }
  });
});
