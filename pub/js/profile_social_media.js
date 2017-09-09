$(document).delegate("#social-media-save", "click", function() {
  var id = $(this).data("id"),
      social_media = {};

  social_media.reddit = $("#profile-show-reddit").is(":checked");
  social_media.discord = $("#profile-show-discord").is(":checked");
  if ($("#profile-facebook").val().trim().length > 0) {
    social_media.facebook = $("#profile-facebook").val();
  }
  if ($("#profile-twitter").val().trim().length > 0) {
    social_media.twitter = $("#profile-twitter").val();
  }
  if ($("#profile-youtube").val().trim().length > 0) {
    social_media.youtube = $("#profile-youtube").val();
  }
  if ($("#profile-instagram").val().trim().length > 0) {
    social_media.instagram = $("#profile-instagram").val();
  }
  if ($("#profile-snapchat").val().trim().length > 0) {
    social_media.snapchat = $("#profile-snapchat").val();
  }
  if ($("#profile-steam").val().trim().length > 0) {
    social_media.steam = $("#profile-steam").val();
  }
  if ($("#profile-deviantart").val().trim().length > 0) {
    social_media.deviantart = $("#profile-deviantart").val();
  }
  if ($("#profile-soundcloud").val().trim().length > 0) {
    social_media.soundcloud = $("#profile-soundcloud").val();
  }
  if ($("#profile-github").val().trim().length > 0) {
    social_media.github = $("#profile-github").val();
  }
  if ($("#profile-googleplus").val().trim().length > 0) {
    social_media.googleplus = $("#profile-googleplus").val();
  }
  if ($("#profile-linkedin").val().trim().length > 0) {
    social_media.linkedin = $("#profile-linkedin").val();
  }
  if ($("#profile-tumblr").val().trim().length > 0) {
    social_media.tumblr = $("#profile-tumblr").val();
  }
  if ($("#profile-facebook-url").val().trim().length > 0) {
    social_media.facebook_url = $("#profile-facebook-url").val();
  }
  if ($("#profile-youtube-url").val().trim().length > 0) {
    social_media.youtube_url = $("#profile-youtube-url").val();
  }

  $.post("/profile/submit/social_media", {
    id: id,
    social_media: social_media
  }, function(data) {
    if (data.message == "success") {
      location.reload();
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
