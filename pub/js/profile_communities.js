$(document).delegate("#communities-save", "click", function() {
  var id = $(this).data("id"),
      communities = {};

  if ($("#profile-communities-discord").val().trim().length > 0) {
    communities.discord = $("#profile-communities-discord").val();
  }
  if ($("#profile-communities-steam").val().trim().length > 0) {
    communities.steam = $("#profile-communities-steam").val();
  }
  if ($("#profile-communities-subreddit").val().trim().length > 0) {
    communities.subreddit = $("#profile-communities-subreddit").val();
  }
  if ($("#profile-communities-twitch").val().trim().length > 0) {
    communities.twitch = $("#profile-communities-twitch").val();
  }
  if ($("#profile-communities-desktop").val().trim().length > 0) {
    communities.desktop = $("#profile-communities-desktop").val();
  }

  $.post("/profile/submit/communities", {
    id: id,
    communities: communities
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("Your community groups were updated.", 4000, "rounded");
    }
    else if (data.message == "invalid") {
      Materialize.toast("You have entered an invalid URL.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
