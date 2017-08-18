$(document).ready(function() {
  var height = $("body").height();
  $("#profile-stream").css("height", height - 425 + "px");
});

$(document).delegate("#profile-appearance-save", "click", function() {
  var id = $(this).data("id"),
      flair = $("#profile-appearance-flair").val(),
      appearance = {},
      primary_type;

  if ($("#profile-appearance-clip").val().trim().length > 0) {
    appearance.clip = $("#profile-appearance-clip").val();
  }
  else {
    appearance.clip = null;
  }

  primary_type = $("#profile-appearance-category select").val();
  appearance.videos = $("#profile-appearance-videos").is(":checked");
  appearance.events = $("#profile-appearance-events").is(":checked");
  appearance.teams = $("#profile-appearance-teams").is(":checked");

  $.post("/profile/submit/appearance", {
    id: id,
    appearance: appearance,
    flair: flair,
    primary_type: primary_type
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("Your profile's appearance was updated.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
