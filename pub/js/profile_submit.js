$(document).delegate("#create-profile", "click", function() {
  $("#no-profile").slideUp();
  $("#profile-settings-wrapper").slideUp();
  $("#profile-view-wrapper").slideUp();
  $("#profile-mobile-settings").slideUp();
  $("#profile-return-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-return-wrapper").slideUp();
  $("#submit-profile-wrapper").slideDown();
  $("#create-profile-header").slideDown();
  $("#step-1").slideDown();
});

$(document).delegate("#edit-profile", "click", function() {
  $("#profile-wrapper").slideUp();
  $("#profile-settings-wrapper #profile-edit-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-edit-wrapper").slideUp();
  $("#profile-settings-wrapper").slideUp();
  $("#profile-view-wrapper").slideUp();
  $("#profile-mobile-settings").slideUp();
  $("#profile-requests-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-requests-wrapper").slideUp();
  $("#profile-refresh-wrapper").slideDown();
  $("#profile-mobile-settings-wrapper #profile-refresh-wrapper").slideDown();
  $("#submit-profile-wrapper").slideDown();
  $("#edit-profile-header").slideDown();
  $("#step-1").slideDown();
});

$(document).delegate("#profile-refresh-wrapper a", "click", function() {
  location.reload();
});

$(document).delegate("#next-step-2", "click", function() {
  if ($("#profile-introduction").val().trim().length >= 1 && $("#profile-introduction").val().trim().length <= 100 && $("#profile-about").val().trim().length >= 200 && $("#profile-background").val().trim().length >= 200) {
    $("#step-1").slideUp();
    $("#step-2").slideDown();
  }
  else {
    if ($("#profile-introduction").val().trim().length >= 1 || $("#profile-introduction").val().trim().length <= 100) {
      $("#profile-introduction").addClass("invalid");
    }
    if ($("#profile-about").val().trim().length < 200) {
      $("#profile-about").addClass("invalid");
    }
    if ($("#profile-background").val().trim().length < 200) {
      $("#profile-background").addClass("invalid");
    }
    setTimeout(function() {
      $("#profile-introduction").removeClass("invalid");
      $("#profile-about").removeClass("invalid");
      $("#profile-background").removeClass("invalid");
    }, 3000);
    Materialize.toast('You have not completed a field in sufficient detail.', 4000, 'rounded');
  }
});

$(document).delegate("#next-step-3", "click", function() {
  $("#profile-type-streamer-gaming-wrapper").hide();
  $("#profile-type-streamer-creative-wrapper").hide();
  $("#profile-type-streamer-socialeating-wrapper").hide();
  $("#profile-type-streamer-irl-wrapper").hide();
  $("#profile-type-streamer-talkshow-wrapper").hide();
  $("#profile-type-streamer-music-wrapper").hide();
  $("#profile-type-artist-wrapper").hide();
  $("#profile-type-developer-wrapper").hide();
  $("#profile-type-communitymanager-wrapper").hide();
  $("#profile-type-moderator-wrapper").hide();
  $("#profile-type-viewer-wrapper").hide();
  $("#profile-type-other-wrapper").hide();
  $("#profile-flair-badge select").html("");
  var selected = false;
  if ($('#profile-type-streamer-gaming').is(':checked')) {
    $("#profile-type-streamer-gaming-wrapper").show();
    $("#profile-flair-badge select").append('<option value="streamer_gaming">Gaming Streamer</option>')
    selected = true;
  }
  if ($('#profile-type-streamer-creative').is(':checked')) {
    $("#profile-type-streamer-creative-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="streamer_creative">Creative Streamer</option>')
  }
  if ($('#profile-type-streamer-irl').is(':checked')) {
    $("#profile-type-streamer-irl-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="streamer_irl">IRL Streamer</option>')
  }
  if ($('#profile-type-streamer-socialeating').is(':checked')) {
    $("#profile-type-streamer-socialeating-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="streamer_socialeating">Social Eating Streamer</option>')
  }
  if ($('#profile-type-streamer-talkshow').is(':checked')) {
    $("#profile-type-streamer-talkshow-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="streamer_talkshow">Talk Show Streamer</option>')
  }
  if ($('#profile-type-streamer-music').is(':checked')) {
    $("#profile-type-streamer-music-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="streamer_music">Music Streamer</option>')
  }
  if ($('#profile-type-artist').is(':checked')) {
    $("#profile-type-artist-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="artist">Artist</option>')
  }
  if ($('#profile-type-developer').is(':checked')) {
    $("#profile-type-developer-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="developer">Developer</option>')
  }
  if ($('#profile-type-communitymanager').is(':checked')) {
    $("#profile-type-communitymanager-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="communitymanager">Community Manager</option>')
  }
  if ($('#profile-type-moderator').is(':checked')) {
    $("#profile-type-moderator-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="moderator">Moderator</option>')
  }
  if ($('#profile-type-viewer').is(':checked')) {
    $("#profile-type-viewer-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="viewer">Viewer</option>')
  }
  if ($('#profile-type-other').is(':checked')) {
    $("#profile-type-other-wrapper").show();
    selected = true;
    $("#profile-flair-badge select").append('<option value="other">Other</option>')
  }
  if (selected === true) {
    $("#step-2").slideUp();
    $("#step-3").slideDown();
    $('select').material_select();
  }
  else {
    Materialize.toast('You have not selected an option.', 4000, 'rounded');
  }
});

$(document).delegate("#next-step-5", "click", function() {
  var data = $("#profile-tags").material_chip('data'),
      tags = [];
  for (var tag of data) {
    tags.push(tag.tag);
  }
  if (tags.length > 15) {
    Materialize.toast('You have entered too many tags.', 4000, 'rounded');
  }
  else if (tags.length < 3) {
    Materialize.toast('You have entered too few tags.', 4000, 'rounded');
  }
  else {
    $("#step-4").slideUp();
    $("#step-5").slideDown();
  }
});

$(document).delegate("#next-step-4", "click", function() {
  var missing = false;
  if ($("#profile-type-streamer-gaming").is(":checked")) {
    var genre = false;
    if (($("#profile-type-streamer-gaming-action").is(":checked")) || ($("#profile-type-streamer-gaming-adventure").is(":checked")) || ($("#profile-type-streamer-gaming-horror").is(":checked")) || ($("#profile-type-streamer-gaming-roleplaying").is(":checked")) || ($("#profile-type-streamer-gaming-simulation").is(":checked")) || ($("#profile-type-streamer-gaming-strategy").is(":checked")) || ($("#profile-type-streamer-gaming-survival").is(":checked")) || ($("#profile-type-streamer-gaming-other").is(":checked"))) {
      genre = true;
    }
    else {
      $("#profile-type-streamer-gaming-genres").addClass("invalid-wrapper");
    }
    if ($("#profile-type-streamer-gaming-goals").val().length === 0 || $("#profile-type-streamer-gaming-favourites").val().length === 0 || genre === false) {
      if ($("#profile-type-streamer-gaming-goals").val().length === 0) {
        $("#profile-type-streamer-gaming-goals").addClass("invalid");
      }
      if ($("#profile-type-streamer-gaming-favourites").val().length === 0) {
        $("#profile-type-streamer-gaming-favourites").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-streamer-creative").is(":checked")) {
    var activity = false;
    if (($("#profile-type-streamer-creative-cooking").is(":checked")) || ($("#profile-type-streamer-creative-cosplay").is(":checked")) || ($("#profile-type-streamer-creative-drawing").is(":checked")) || ($("#profile-type-streamer-creative-music").is(":checked")) || ($("#profile-type-streamer-creative-painting").is(":checked")) || ($("#profile-type-streamer-creative-programming").is(":checked")) || ($("#profile-type-streamer-creative-editing").is(":checked")) || ($("#profile-type-streamer-creative-other").is(":checked"))) {
      activity = true;
    }
    else {
      $("#profile-type-streamer-creative-activities").addClass("invalid-wrapper");
    }
    if ($("#profile-type-streamer-creative-goals").val().length === 0 || $("#profile-type-streamer-creative-creations").val().length === 0 || activity === false) {
      if ($("#profile-type-streamer-creative-goals").val().length === 0) {
        $("#profile-type-streamer-creative-goals").addClass("invalid");
      }
      if ($("#profile-type-streamer-creative-creations").val().length === 0) {
        $("#profile-type-streamer-creative-creations").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-streamer-socialeating").is(":checked")) {
    if ($("#profile-type-streamer-socialeating-goals").val().length === 0 || $("#profile-type-streamer-socialeating-meals").val().length === 0 || $("#profile-type-streamer-socialeating-discussions").val().length === 0) {
      if ($("#profile-type-streamer-socialeating-goals").val().length === 0) {
        $("#profile-type-streamer-socialeating-goals").addClass("invalid");
      }
      if ($("#profile-type-streamer-socialeating-meals").val().length === 0) {
        $("#profile-type-streamer-socialeating-meals").addClass("invalid");
      }
      if ($("#profile-type-streamer-socialeating-discussions").val().length === 0) {
        $("#profile-type-streamer-socialeating-discussions").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-streamer-irl").is(":checked")) {
    if ($("#profile-type-streamer-irl-goals").val().length === 0 || $("#profile-type-streamer-irl-activities").val().length === 0) {
      if ($("#profile-type-streamer-irl-goals").val().length === 0) {
        $("#profile-type-streamer-irl-goals").addClass("invalid");
      }
      if ($("#profile-type-streamer-irl-activities").val().length === 0) {
        $("#profile-type-streamer-irl-activities").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-streamer-talkshow").is(":checked")) {
    if ($("#profile-type-streamer-talkshow-goals").val().length === 0 || $("#profile-type-streamer-talkshow-discussions").val().length === 0 || $("#profile-type-streamer-talkshow-guests").val().length === 0) {
      if ($("#profile-type-streamer-talkshow-goals").val().length === 0) {
        $("#profile-type-streamer-talkshow-goals").addClass("invalid");
      }
      if ($("#profile-type-streamer-talkshow-discussions").val().length === 0) {
        $("#profile-type-streamer-talkshow-discussions").addClass("invalid");
      }
      if ($("#profile-type-streamer-talkshow-guests").val().length === 0) {
        $("#profile-type-streamer-talkshow-guests").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-streamer-music").is(":checked")) {
    if ($("#profile-type-streamer-music-goals").val().length === 0 || $("#profile-type-streamer-music-music").val().length === 0) {
      if ($("#profile-type-streamer-music-goals").val().length === 0) {
        $("#profile-type-streamer-music-goals").addClass("invalid");
      }
      if ($("#profile-type-streamer-music-music").val().length === 0) {
        $("#profile-type-streamer-music-music").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-artist").is(":checked")) {
    if ($("#profile-type-artist-commissions").is(":checked")) {
      if ($("#profile-type-artist-commissions-charge").is(":checked")) {
        if ($("#profile-type-artist-commissions-charge-rate").val().length === 0) {
          $("#profile-type-artist-commissions-charge-rate").addClass("invalid");
          missing = true;
        }
      }
      if ($("#profile-type-artist-commissions-services").val().length === 0 || $("#profile-type-artist-commissions-contact").val().length === 0) {
        if ($("#profile-type-artist-commissions-services").val().length === 0) {
          $("#profile-type-artist-commissions-services").addClass("invalid");
        }
        if ($("#profile-type-artist-commissions-contact").val().length === 0) {
          $("#profile-type-artist-commissions-contact").addClass("invalid");
        }
        missing = true;
      }
    }
    if ($("#profile-type-artist-examples").val().length === 0 || $("#profile-type-artist-attraction").val().length === 0) {
      if ($("#profile-type-artist-examples").val().length === 0) {
        $("#profile-type-artist-examples").addClass("invalid");
      }
      if ($("#profile-type-artist-attraction").val().length === 0) {
        $("#profile-type-artist-attraction").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-developer").is(":checked")) {
    if ($("#profile-type-developer-commissions").is(":checked")) {
      if ($("#profile-type-developer-commissions-charge").is(":checked")) {
        if ($("#profile-type-developer-commissions-charge-rate").val().length === 0) {
          $("#profile-type-developer-commissions-charge-rate").addClass("invalid");
          missing = true;
        }
      }
      if ($("#profile-type-developer-commissions-services").val().length === 0 || $("#profile-type-developer-commissions-contact").val().length === 0) {
        if ($("#profile-type-developer-commissions-services").val().length === 0) {
          $("#profile-type-developer-commissions-services").addClass("invalid");
        }
        if ($("#profile-type-developer-commissions-contact").val().length === 0) {
          $("#profile-type-developer-commissions-contact").addClass("invalid");
        }
        missing = true;
      }
    }
    if ($("#profile-type-developer-examples").val().length === 0 || $("#profile-type-developer-attraction").val().length === 0) {
      if ($("#profile-type-developer-examples").val().length === 0) {
        $("#profile-type-developer-examples").addClass("invalid");
      }
      if ($("#profile-type-developer-attraction").val().length === 0) {
        $("#profile-type-developer-attraction").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-communitymanager").is(":checked")) {
    if ($("#profile-type-communitymanager-examples").val().length === 0 || $("#profile-type-communitymanager-attraction").val().length === 0) {
      if ($("#profile-type-communitymanager-examples").val().length === 0) {
        $("#profile-type-communitymanager-examples").addClass("invalid");
      }
      if ($("#profile-type-communitymanager-attraction").val().length === 0) {
        $("#profile-type-communitymanager-attraction").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-moderator").is(":checked")) {
    if ($("#profile-type-moderator-requests").is(":checked")) {
      if ($("#profile-type-moderator-requirements").val().length === 0 || $("#profile-type-moderator-requests-contact").val().length === 0) {
        if ($("#profile-type-moderator-requirements").val().length === 0) {
          $("#profile-type-moderator-requirements").addClass("invalid");
        }
        if ($("#profile-type-moderator-requests-contact").val().length === 0) {
          $("#profile-type-moderator-requests-contact").addClass("invalid");
        }
        missing = true;
      }
    }
    if ($("#profile-type-moderator-experience").val().length === 0 || $("#profile-type-moderator-attraction").val().length === 0) {
      if ($("#profile-type-moderator-experience").val().length === 0) {
        $("#profile-type-moderator-experience").addClass("invalid");
      }
      if ($("#profile-type-moderator-attraction").val().length === 0) {
        $("#profile-type-moderator-attraction").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-viewer").is(":checked")) {
    var type = false;

    if (($("#profile-type-viewer-streams-action").is(":checked")) || ($("#profile-type-viewer-streams-adventure").is(":checked")) || ($("#profile-type-viewer-streams-roleplaying").is(":checked")) || ($("#profile-type-viewer-streams-simulation").is(":checked")) || ($("#profile-type-viewer-streams-strategy").is(":checked")) || ($("#profile-type-viewer-streams-survival").is(":checked")) || ($("#profile-type-viewer-streams-horror").is(":checked")) || ($("#profile-type-viewer-streams-music").is(":checked")) || ($("#profile-type-viewer-streams-cooking").is(":checked")) || ($("#profile-type-viewer-streams-cosplay").is(":checked")) || ($("#profile-type-viewer-streams-drawing").is(":checked")) || ($("#profile-type-viewer-streams-painting").is(":checked")) || ($("#profile-type-viewer-streams-programming").is(":checked")) || ($("#profile-type-viewer-streams-editing").is(":checked")) || ($("#profile-type-viewer-streams-talkshow").is(":checked")) || ($("#profile-type-viewer-streams-irl").is(":checked")) || ($("#profile-type-viewer-streams-socialeating").is(":checked"))) {
      type = true;
    }
    else {
      $("#profile-type-streamer-viewer-streams").addClass("invalid-wrapper");
    }
    if ($("#profile-type-viewer-experience").val().length === 0 || $("#profile-type-viewer-streamers").val().length === 0 || type === false) {
      if ($("#profile-type-viewer-experience").val().length === 0) {
        $("#profile-type-viewer-experience").addClass("invalid");
      }
      if ($("#profile-type-viewer-streamers").val().length === 0) {
        $("#profile-type-viewer-streamers").addClass("invalid");
      }
      missing = true;
    }
  }
  if ($("#profile-type-other").is(":checked")) {
    if ($("#profile-type-other-description").val().length === 0) {
      $("#profile-type-other-description").addClass("invalid");
      missing = true;
    }
  }
  if (missing === false) {
    $("#step-3").slideUp();
    $("#step-4").slideDown();
    window.scrollTo(0, 0);
  }
  else {
    Materialize.toast("You have not completed a field.", 4000, "rounded");
  }
});

$(document).delegate("textarea", "keyup", function() {
  $(this).removeClass("invalid");
});

$(document).delegate('input[type="checkbox"]', "change", function() {
  $(this).parent().parent().parent().removeClass("invalid-wrapper");
  $(this).parent().parent().parent().parent().removeClass("invalid-wrapper");
});

$(document).delegate("#back-step-1", "click", function() {
  $("#step-2").slideUp();
  $("#step-1").slideDown();
});

$(document).delegate("#back-step-2", "click", function() {
  $("#step-3").slideUp();
  $("#step-2").slideDown();
});

$(document).delegate("#back-step-3", "click", function() {
  $("#step-4").slideUp();
  $("#step-3").slideDown();
});

$(document).delegate("#back-step-4", "click", function() {
  $("#step-5").slideUp();
  $("#step-4").slideDown();
});

$(document).delegate("#profile-type-artist-commissions", "click", function() {
  if (this.checked) {
    $("#artist-commissions").slideDown();
  }
  else {
    $("#artist-commissions").slideUp();
  }
});

$(document).delegate("#profile-type-artist-commissions-charge", "click", function() {
  if (this.checked) {
    $("#artist-commissions-charge").slideDown();
  }
  else {
    $("#artist-commissions-charge").slideUp();
  }
});

$(document).delegate("#profile-type-artist-commissions", "click", function() {
  if (this.checked) {
    $("#artist-commissions").show();
  }
  else {
    $("#artist-commissions").hide();
  }
});

$(document).delegate("#profile-type-artist-commissions-charge", "click", function() {
  if (this.checked) {
    $("#artist-commissions-charge").show();
  }
  else {
    $("#artist-commissions-charge").hide();
  }
});

$(document).delegate("#profile-type-developer-commissions", "click", function() {
  if (this.checked) {
    $("#developer-commissions").show();
  }
  else {
    $("#developer-commissions").hide();
  }
});

$(document).delegate("#profile-type-developer-commissions-charge", "click", function() {
  if (this.checked) {
    $("#developer-commissions-charge").show();
  }
  else {
    $("#developer-commissions-charge").hide();
  }
});

$(document).delegate("#profile-type-moderator-requests", "click", function() {
  if (this.checked) {
    $("#moderator-requests").show();
  }
  else {
    $("#moderator-requests").hide();
  }
});

$(document).delegate("#submit-profile", "click", function() {
  var edit = $(this).data("edit");

  var data = {};
  data.overview = {};
  data.types = {};
  data.votes = [];
  data.status = "pending";
  data.rejection_reason = null;
  data.notifications = {};
  data.date = Date.now();

  data.overview.introduction = $("#profile-introduction").val();
  data.overview.about = $("#profile-about").val();
  data.overview.background = $("#profile-background").val();

  data.notifications.twitch = $("#profile-notifications-twitch").is(":checked");
  data.notifications.reddit = $("#profile-notifications-reddit").is(":checked");
  data.notifications.discord = $("#profile-notifications-discord").is(":checked");

  data.tags = [];
  var tags = $("#profile-tags").material_chip('data');
  for (var tag of tags) {
    data.tags.push(tag.tag);
  }

  if ($('#profile-type-streamer-gaming').is(':checked')) {
    data.types.streamer_gaming = {};
    data.types.streamer_gaming.goals = $("#profile-type-streamer-gaming-goals").val();
    data.types.streamer_gaming.favourites = $("#profile-type-streamer-gaming-favourites").val();
    data.types.streamer_gaming.genres = {};
    if ($('#profile-type-streamer-gaming-action').is(':checked')) {
      data.types.streamer_gaming.genres.action = true;
    }
    if ($('#profile-type-streamer-gaming-adventure').is(':checked')) {
      data.types.streamer_gaming.genres.adventure = true;
    }
    if ($('#profile-type-streamer-gaming-horror').is(':checked')) {
      data.types.streamer_gaming.genres.horror = true;
    }
    if ($('#profile-type-streamer-gaming-roleplaying').is(':checked')) {
      data.types.streamer_gaming.genres.roleplaying = true;
    }
    if ($('#profile-type-streamer-gaming-simulation').is(':checked')) {
      data.types.streamer_gaming.genres.simulation = true;
    }
    if ($('#profile-type-streamer-gaming-strategy').is(':checked')) {
      data.types.streamer_gaming.genres.strategy = true;
    }
    if ($('#profile-type-streamer-gaming-survival').is(':checked')) {
      data.types.streamer_gaming.genres.survival = true;
    }
    if ($('#profile-type-streamer-gaming-other').is(':checked')) {
      data.types.streamer_gaming.genres.other = true;
    }
    data.types.streamer_gaming.collaborations = $("#profile-type-streamer-gaming-collaborations").is(":checked");
    data.types.streamer_gaming.charity = $("#profile-type-streamer-gaming-charity").is(":checked");
  }
  if ($('#profile-type-streamer-creative').is(':checked')) {
    data.types.streamer_creative = {};
    data.types.streamer_creative.goals = $("#profile-type-streamer-creative-goals").val();
    data.types.streamer_creative.creations = $("#profile-type-streamer-creative-creations").val();
    data.types.streamer_creative.activities = {};
    if ($('#profile-type-streamer-creative-cooking').is(':checked')) {
      data.types.streamer_creative.activities.cooking = true;
    }
    if ($('#profile-type-streamer-creative-cosplay').is(':checked')) {
      data.types.streamer_creative.activities.cosplay = true;
    }
    if ($('#profile-type-streamer-creative-drawing').is(':checked')) {
      data.types.streamer_creative.activities.drawing = true;
    }
    if ($('#profile-type-streamer-creative-music').is(':checked')) {
      data.types.streamer_creative.activities.music = true;
    }
    if ($('#profile-type-streamer-creative-painting').is(':checked')) {
      data.types.streamer_creative.activities.painting = true;
    }
    if ($('#profile-type-streamer-creative-programming').is(':checked')) {
      data.types.streamer_creative.activities.programming = true;
    }
    if ($('#profile-type-streamer-creative-editing').is(':checked')) {
      data.types.streamer_creative.activities.editing = true;
    }
    if ($('#profile-type-streamer-creative-other').is(':checked')) {
      data.types.streamer_creative.activities.other = true;
    }
    data.types.streamer_creative.collaborations = $("#profile-type-streamer-creative-collaborations").is(":checked");
    data.types.streamer_creative.charity = $("#profile-type-streamer-creative-charity").is(":checked");
  }
  if ($('#profile-type-streamer-socialeating').is(':checked')) {
    data.types.streamer_socialeating = {};
    data.types.streamer_socialeating.goals = $("#profile-type-streamer-socialeating-goals").val();
    data.types.streamer_socialeating.meals = $("#profile-type-streamer-socialeating-meals").val();
    data.types.streamer_socialeating.discussions = $("#profile-type-streamer-socialeating-discussions").val();
    data.types.streamer_socialeating.collaborations = $("#profile-type-streamer-socialeating-collaborations").is(":checked");
    data.types.streamer_socialeating.charity = $("#profile-type-streamer-socialeating-charity").is(":checked");
  }
  if ($('#profile-type-streamer-irl').is(':checked')) {
    data.types.streamer_irl = {};
    data.types.streamer_irl.goals = $("#profile-type-streamer-irl-goals").val();
    data.types.streamer_irl.activities = $("#profile-type-streamer-irl-activities").val();
    data.types.streamer_irl.collaborations = $("#profile-type-streamer-irl-collaborations").is(":checked");
    data.types.streamer_irl.charity = $("#profile-type-streamer-irl-charity").is(":checked");
  }
  if ($('#profile-type-streamer-talkshow').is(':checked')) {
    data.types.streamer_talkshow = {};
    data.types.streamer_talkshow.goals = $("#profile-type-streamer-talkshow-goals").val();
    data.types.streamer_talkshow.discussions = $("#profile-type-streamer-talkshow-discussions").val();
    data.types.streamer_talkshow.guests = $("#profile-type-streamer-talkshow-guests").val();
    data.types.streamer_talkshow.collaborations = $("#profile-type-streamer-talkshow-collaborations").is(":checked");
    data.types.streamer_talkshow.charity = $("#profile-type-streamer-talkshow-charity").is(":checked");
  }
  if ($('#profile-type-streamer-music').is(':checked')) {
    data.types.streamer_music = {};
    data.types.streamer_music.goals = $("#profile-type-streamer-music-goals").val();
    data.types.streamer_music.music = $("#profile-type-streamer-music-music").val();
    data.types.streamer_music.collaborations = $("#profile-type-streamer-music-collaborations").is(":checked");
    data.types.streamer_music.charity = $("#profile-type-streamer-music-charity").is(":checked");
  }
  if ($('#profile-type-artist').is(':checked')) {
    data.types.artist = {};
    data.types.artist.examples = $("#profile-type-artist-examples").val();
    data.types.artist.attraction = $("#profile-type-artist-attraction").val();
    if ($('#profile-type-artist-commissions').is(':checked')) {
      data.types.artist.commissions = {};
      data.types.artist.commissions.services = $("#profile-type-artist-commissions-services").val();
      data.types.artist.commissions.contact = $("#profile-type-artist-commissions-contact").val();
      if ($('#profile-type-artist-commissions-charge').is(':checked')) {
        data.types.artist.commissions.charge = $("#profile-type-artist-commissions-charge-rate").val();
      }
      else {
        data.types.artist.commissions.charge = null;
      }
      if ($('#profile-type-artist-commissions-accepting').is(':checked')) {
        data.types.artist.commissions.accepting = true;
      }
      else {
        data.types.artist.commissions.accepting = false;
      }
    }
  }
  if ($('#profile-type-developer').is(':checked')) {
    data.types.developer = {};
    data.types.developer.examples = $("#profile-type-developer-examples").val();
    data.types.developer.attraction = $("#profile-type-developer-attraction").val();
    if ($('#profile-type-developer-commissions').is(':checked')) {
      data.types.developer.commissions = {};
      data.types.developer.commissions.services = $("#profile-type-developer-commissions-services").val();
      data.types.developer.commissions.contact = $("#profile-type-developer-commissions-contact").val();
      if ($('#profile-type-developer-commissions-charge').is(':checked')) {
        data.types.developer.commissions.charge = $("#profile-type-developer-commissions-charge-rate").val();
      }
      else {
        data.types.developer.commissions.charge = null;
      }
      if ($('#profile-type-developer-commissions-accepting').is(':checked')) {
        data.types.developer.commissions.accepting = true;
      }
      else {
        data.types.developer.commissions.accepting = false;
      }
    }
  }
  if ($('#profile-type-communitymanager').is(':checked')) {
    data.types.communitymanager = {};
    data.types.communitymanager.examples = $("#profile-type-communitymanager-examples").val();
    data.types.communitymanager.attraction = $("#profile-type-communitymanager-attraction").val();
  }
  if ($('#profile-type-moderator').is(':checked')) {
    data.types.moderator = {};
    data.types.moderator.experience = $("#profile-type-moderator-experience").val();
    data.types.moderator.attraction = $("#profile-type-moderator-attraction").val();
    if ($('#profile-type-moderator-requests').is(':checked')) {
      data.types.moderator.requests = {};
      data.types.moderator.requests.requirements = $("#profile-type-moderator-requirements").val();
      data.types.moderator.requests.contact = $("#profile-type-moderator-requests-contact").val();
    }
  }
  if ($('#profile-type-viewer').is(':checked')) {
    data.types.viewer = {};
    data.types.viewer.experience = $("#profile-type-viewer-experience").val();
    data.types.viewer.streamers = $("#profile-type-viewer-streamers").val();
    data.types.viewer.streams = {};
    if ($('#profile-type-viewer-streams-action').is(':checked')) {
      data.types.viewer.streams.action = true;
    }
    if ($('#profile-type-viewer-streams-adventure').is(':checked')) {
      data.types.viewer.streams.adventure = true;
    }
    if ($('#profile-type-viewer-streams-horror').is(':checked')) {
      data.types.viewer.streams.horror = true;
    }
    if ($('#profile-type-viewer-streams-roleplaying').is(':checked')) {
      data.types.viewer.streams.roleplaying = true;
    }
    if ($('#profile-type-viewer-streams-simulation').is(':checked')) {
      data.types.viewer.streams.simulation = true;
    }
    if ($('#profile-type-viewer-streams-strategy').is(':checked')) {
      data.types.viewer.streams.strategy = true;
    }
    if ($('#profile-type-viewer-streams-survival').is(':checked')) {
      data.types.viewer.streams.survival = true;
    }
    if ($('#profile-type-viewer-streams-cooking').is(':checked')) {
      data.types.viewer.streams.cooking = true;
    }
    if ($('#profile-type-viewer-streams-cosplay').is(':checked')) {
      data.types.viewer.streams.cosplay = true;
    }
    if ($('#profile-type-viewer-streams-drawing').is(':checked')) {
      data.types.viewer.streams.drawing = true;
    }
    if ($('#profile-type-viewer-streams-painting').is(':checked')) {
      data.types.viewer.streams.painting = true;
    }
    if ($('#profile-type-viewer-streams-programming').is(':checked')) {
      data.types.viewer.streams.programming = true;
    }
    if ($('#profile-type-viewer-streams-editing').is(':checked')) {
      data.types.viewer.streams.editing = true;
    }
    if ($('#profile-type-viewer-streams-talkshow').is(':checked')) {
      data.types.viewer.streams.talkshow = true;
    }
    if ($('#profile-type-viewer-streams-irl').is(':checked')) {
      data.types.viewer.streams.irl = true;
    }
    if ($('#profile-type-viewer-streams-socialeating').is(':checked')) {
      data.types.viewer.streams.socialeating = true;
    }
    if ($('#profile-type-viewer-streams-music').is(':checked')) {
      data.types.viewer.streams.music = true;
    }
    if ($('#profile-type-viewer-family').is(':checked')) {
      data.types.viewer.family = true;
    }
  }
  if ($('#profile-type-other').is(':checked')) {
    data.types.other = $("#profile-type-other-description").val();
  }

  $.post("/profile/submit", {
    id: $("#submit-profile").data("id"),
    profile: data,
    primary_type: $("#profile-flair-badge select").val()
  }, function(response) {
    if (response.message == "success") {
      Materialize.toast('Your profile has been submitted for approval.', 4000, 'rounded');
      if (edit) {
        window.location.replace("/profile")
      }
      else {
        window.location.replace("/profile?tutorial=true")
      }
    }
    else if (response.message == "forbidden") {
      Materialize.toast('You do not have permission to do that.', 4000, 'rounded');
    }
    else {
      Materialize.toast('An unknown error occurred.', 4000, 'rounded');
    }
  });
});

$(document).delegate("#profile-data", "click", function() {
  if (!$("#profile-data .active").html()) {
    $("#profile-data li:nth-of-type(1)").addClass("active");
    $("#profile-data li:nth-of-type(1) div:nth-of-type(1)").addClass("active");
    $('.collapsible').collapsible();
  }
});

$(document).delegate(".count", "keyup", function() {
  $(this).parent().children().children().html($(this).val().length);
});

$(document).delegate("#profile-tag", "click", function() {
  $.post("/browse/query/tag", {
    tag: $(this).html()
  }, function(data) {
    if (data.message == "success") {
      window.location.replace(data.redirect);
    }
  });
});

$(document).ready(function() {
  $('.chips').material_chip();

  var tags = $("#profile-tags").data("tags").split(","),
      data = [];

  for (var tag of tags) {
    data.push({ tag: tag });
  }

  $("#profile-tags").material_chip({ data: data });

  $('.tap-target').tapTarget('open');
});
