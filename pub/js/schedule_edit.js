$(document).ready(function() {
  var d = new Date(),
  timezone = d.toLocaleString('en', { timeZoneName:'short' }).split(' ').pop();
  $("#stream-timezone").html(timezone)
});

$(document).delegate("#stream-directory", "keyup", function() {
  var query = $(this).val();
  if (query.length > 2) {
    $.post("/schedule/streams/directories", {
      query: query,
    }, function(data) {
      var result = {};
      if (data.data.games) {
        for (var directory of data.data.games) {
          result[directory.name] = null;
        }
        $('#stream-directory').autocomplete({
          data: result,
          limit: 10
        });
      }
    });
  }
});

$(document).delegate("#stream-submit", "click", function() {
  var id = $(this).data("id"),
      title = $("#stream-title").val(),
      description = $("#stream-description").val(),
      start = new Date($("#stream-start-date").val()),
      end = new Date($("#stream-end-date").val()),
      directory = $("#stream-directory").val();

  start.setHours($("#stream-start-time").val().split(":")[0]);
  start.setMinutes($("#stream-start-time").val().split(":")[1]);
  end.setHours($("#stream-end-time").val().split(":")[0]);
  end.setMinutes($("#stream-end-time").val().split(":")[1]);

  if (title && description && directory && !isNaN(start.getTime()) && !isNaN(end.getTime()) && new Date(start).getTime() < new Date(end).getTime() && (new Date(start).getMinutes() == 0 || new Date(start).getMinutes() == 30) && (new Date(end).getMinutes() == 0 || new Date(end).getMinutes() == 30)) {
    $.post("/schedule/streams/save", {
      id: id,
      title: title,
      description: description,
      start: start.getTime(),
      end: end.getTime(),
      directory: directory
    }, function(data) {
      if (data.message == "success") {
        window.location.replace("/schedule/");
      }
      else if (data.message == "invalid_game") {
        Materialize.toast("You have entered an invalid directory.", 4000, "rounded");
        $("#stream-directory").addClass("invalid");
        setTimeout(function() {
          $("#stream-directory").removeClass("invalid");
        }, 3000);
      }
      else if (data.message == "invalid_timestamp") {
        Materialize.toast("You have entered a stream that clashes with another.", 4000, "rounded");
        $("#stream-start-date").addClass("invalid");
        $("#stream-start-time").addClass("invalid");
        $("#stream-end-date").addClass("invalid");
        $("#stream-end-time").addClass("invalid");
        setTimeout(function() {
          $("#stream-start-date").removeClass("invalid");
          $("#stream-start-time").removeClass("invalid");
          $("#stream-end-date").removeClass("invalid");
          $("#stream-end-time").removeClass("invalid");
        }, 3000);
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
      }
      else {
        Materialize.toast("An unknown error occured.", 4000, "rounded");
      }
    });
  }
  else {
    if (!title) {
      $("#stream-title").addClass("invalid");
    }
    if (!description) {
      $("#stream-description").addClass("invalid");
    }
    if (!directory) {
      $("#stream-directory").addClass("invalid");
    }
    if (isNaN(start.getTime()) || new Date(start).getTime() >= new Date(end).getTime() || !(new Date(start).getMinutes() == 0 || new Date(start).getMinutes() == 30)) {
      $("#stream-start-date").addClass("invalid");
      $("#stream-start-time").addClass("invalid");
    }
    if (isNaN(end.getTime()) || new Date(start).getTime() >= new Date(end).getTime() || !(new Date(end).getMinutes() == 0 || new Date(end).getMinutes() == 30)) {
      $("#stream-end-date").addClass("invalid");
      $("#stream-end-time").addClass("invalid");
    }
    setTimeout(function() {
      $("#stream-title").removeClass("invalid");
      $("#stream-description").removeClass("invalid");
      $("#stream-directory").removeClass("invalid");
      $("#stream-start-date").removeClass("invalid");
      $("#stream-start-time").removeClass("invalid");
      $("#stream-end-date").removeClass("invalid");
      $("#stream-end-time").removeClass("invalid");
    }, 3000);
    Materialize.toast("You have not filled out all fields correctly.", 4000, "rounded");
  }
});
