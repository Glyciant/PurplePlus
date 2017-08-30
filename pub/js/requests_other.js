$(document).delegate("#submit-request", "click", function() {
  var reddit = $(this).data("reddit"),
      twitch = $(this).data("twitch"),
      data = {
        name: $("#tool-name").val(),
        description: $("#tool-description").val()
      };

  if (data.description && data.name) {
    $.post("/requests/submit", {
      reddit: reddit,
      twitch: twitch,
      type: "other",
      data: data
    }, function(data) {
      if (data.message == "success") {
        window.location = data.redirect;
      }
      else if (data.message == "forbidden") {
        Materialize.toast('You do not have permission to do that.', 4000, 'rounded');
      }
      else {
        Materialize.toast('An unknown error occurred.', 4000, 'rounded');
      }
    });
  }
  else {
    if (!data.name) {
      $("#tool-name").addClass("invalid");
    }
    if (!data.description) {
      $("#tool-description").addClass("invalid");
    }
    setTimeout(function() {
      $("#tool-name").removeClass("invalid");
      $("#tool-description").removeClass("invalid");
    }, 3000);
    Materialize.toast('You have not completed a field.', 4000, 'rounded');
  }
});
