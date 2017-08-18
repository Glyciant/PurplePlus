$(document).delegate("#search", "click", function() {
  var field = $("#search-field select").val(),
      query = $("#search-query").val();

  $.post("/admin/accounts/get/", {
    field: field,
    query: query
  }, function(data) {
    $("#search-data").slideUp("fast", function() {
      if (data.message == "success") {
        $("#search-data-submit").data("id", data.data.twitch_id);
        $("#search-data-header").html(data.data.twitch_name)
        $("#search-data-twitch-id").html(data.data.twitch_id);
        $("#search-data-twitch-name").html(data.data.twitch_name);
        if (data.data.display.twitch == "global_mod") {
          $("#search-data-twitch-type").html("Global Moderator")
        }
        else {
          $("#search-data-twitch-type").html(data.data.display.twitch);
        }
        if (data.data.reddit_id) {
          $("#search-data-reddit-id").html(data.data.reddit_id);
          $("#search-data-reddit-name").html(data.data.reddit_name);
        }
        if (data.data.discord_id) {
          $("#search-data-discord-id").html(data.data.discord_id);
          $("#search-data-discord-name").html(data.data.discord_name + "#" + data.data.discord_tag);
        }
        var d = new Date(data.data.last_login);
        $("#search-data-last-login").html(d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
        if (data.data.profile) {
          var d = new Date(parseInt(data.data.profile.created));
          $("#search-data-profile-creation").html(d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
          var d = new Date(parseInt(data.data.profile.updated));
          $("#search-data-profile-update").html(d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
          if (data.data.profile.status == "pending") {
            $("#search-data-profile-flair select").prop("disabled", true);
            $("#search-data-profile-pending").prop("checked", true);
            $("#search-data-profile-rejection-reason").prop("disabled", true);
          }
          else if (data.data.profile.status == "approved") {
            $("#search-data-profile-flair select").prop("disabled", false);
            $("#search-data-profile-flair select").val(data.data.display.profile);
            $("#search-data-profile-approved").prop("checked", true);
            $("#search-data-profile-rejection-reason").prop("disabled", true);
            $("#search-data-profile-rejection-reason select").val("");
          }
          else if (data.data.profile.status == "rejected") {
            $("#search-data-profile-flair select").prop("disabled", true);
            $("#search-data-profile-rejected").prop("checked", true);
            $("#search-data-profile-rejection-reason").prop("disabled", false);
            $("#search-data-profile-rejection-reason select").val(data.data.profile.rejection_reason);
          }
        }
        else {
          $("#search-data-profile-flair select").prop("disabled", true);
          $("#search-data-profile-pending").prop("disabled", true);
          $("#search-data-profile-approved").prop("disabled", true);
          $("#search-data-profile-rejected").prop("disabled", true);
          $("#search-data-profile-clear").prop("disabled", true);
        }
        if (data.data.transactions) {
          $("#search-data-twoos-balance").val(data.data.balance);
          $("#search-data-twoos-transactions").html(data.data.transactions.length);
        }
        else {
          $("#search-data-twoos-balance").prop("disabled", true);
        }
        if (data.data.requests) {
          $("#search-data-ad-requests").html(data.data.requests.length);
        }
        $("#search-data-bans-profile").prop("checked", data.data.bans.profile);
        $("#search-data-bans-nominations").prop("checked", data.data.bans.nominations);
        $("#search-data-bans-requests").prop("checked", data.data.bans.requests);
        $("#search-data-type select").val(data.data.type);
        $("#search-data-subreddit-type select").val(data.data.display.subreddit);
        if (data.data.display.ama === true) {
          $("#search-data-ama-flair").prop("checked", true);
        }
        else {
          $("#search-data-ama-flair").prop("checked", false);
        }
        if (data.data.admin === true) {
          $("#search-data-admin").prop("checked", true);
        }
        else {
          $("#search-data-admin").prop("checked", false);
        }
        $('select').material_select();
        Materialize.updateTextFields();
        $("#search-data").slideDown("fast");
      }
      else if (data.message == "not_found") {
        Materialize.toast("That user does not appear to exist.", 4000, "rounded");
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that.", 4000, "rounded");
      }
      else {
        Materialize.toast("An unknown error occurred.", 4000, "rounded");
      }
    });
  });
});

$(document).delegate("#search-data-submit", "click", function() {
  var id = $(this).data("id"),
      field = $(this).data("field"),
      balance = $("#search-data-twoos-balance").val(),
      type = $("#search-data-type select").val(),
      subreddit = $("#search-data-subreddit-type select").val(),
      flair = $("#search-data-profile-flair select").val(),
      rejection_reason = $("#search-data-profile-rejection-reason select").val(),
      bans = {
        profile: $("#search-data-bans-profile").is(":checked"),
        nominations: $("#search-data-bans-nominations").is(":checked"),
        requests: $("#search-data-bans-requests").is(":checked")
      },
      profile,
      ama,
      admin;

  if ($("#search-data-profile-pending").is(":checked")) {
    profile = "pending";
  }
  else if ($("#search-data-profile-approved").is(":checked")) {
    profile = "approved";
  }
  else if ($("#search-data-profile-rejected").is(":checked")) {
    profile = "rejected";
  }
  else if ($("#search-data-profile-clear").is(":checked")) {
    profile = "clear";
  }

  if ($("#search-data-ama-flair").is(":checked")) {
    ama = true;
  }
  else {
    ama = false;
  }

  if ($("#search-data-admin").is(":checked")) {
    admin = true;
  }
  else {
    admin = false;
  }

  $.post("/admin/accounts/submit/", {
    id: id,
    field: field,
    balance: balance,
    type: type,
    subreddit: subreddit,
    flair: flair,
    rejection_reason: rejection_reason,
    bans: bans,
    profile: profile,
    ama: ama,
    admin: admin
  }, function(data) {
    if (data.message == "success") {
      $("#search-data").slideUp();
      Materialize.toast("The user's data was updated.", 4000, "rounded");
    }
    else if (data.message == "not_found") {
      Materialize.toast("That user does not appear to exist.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#search-data-profile-pending, #search-data-profile-approved, #search-data-profile-rejected, #search-data-profile-clear", "change", function() {
  if (!$("#search-data-profile-approved").is(":checked")) {
    $("#search-data-profile-flair select").prop("disabled", true);
    $("#search-data-profile-flair select").val("");
  }
  else {
    $("#search-data-profile-flair select").prop("disabled", false);
    $("#search-data-profile-flair select").val("");
  }
  if (!$("#search-data-profile-rejected").is(":checked")) {
    $("#search-data-profile-rejection-reason select").prop("disabled", true);
    $("#search-data-profile-rejection-reason select").val("");
  }
  else {
    $("#search-data-profile-rejection-reason select").prop("disabled", false);
    $("#search-data-profile-rejection-reason select").val("");
  }
  $('select').material_select();
});

$(document).delegate("#user-list-submit", "click", function() {
  var data = {};
  if ($("#user-list-one").is(":checked")) {
    data.method = "one";
  }
  else if ($("#user-list-all").is(":checked")) {
    data.method = "all";
  }
  if ($("#user-list-site-admins-yes").is(":checked")) {
    data.site_admin = true;
  }
  else if ($("#user-list-site-admins-no").is(":checked")) {
    data.site_admin = false;
  }
  if ($("#user-list-mod-yes").is(":checked")) {
    data.mod = true;
  }
  else if ($("#user-list-mod-no").is(":checked")) {
    data.mod = false;
  }
  if ($("#user-list-helper-yes").is(":checked")) {
    data.helper = true;
  }
  else if ($("#user-list-helper-no").is(":checked")) {
    data.helper = false;
  }
  if ($("#user-list-wiki-yes").is(":checked")) {
    data.wiki = true;
  }
  else if ($("#user-list-wiki-no").is(":checked")) {
    data.wiki = false;
  }
  if ($("#user-list-contributor-yes").is(":checked")) {
    data.contributor = true;
  }
  else if ($("#user-list-contributor-no").is(":checked")) {
    data.contributor = false;
  }
  if ($("#user-list-bot-yes").is(":checked")) {
    data.bot = true;
  }
  else if ($("#user-list-bot-no").is(":checked")) {
    data.bot = false;
  }
  if ($("#user-list-staff-yes").is(":checked")) {
    data.staff = true;
  }
  else if ($("#user-list-staff-no").is(":checked")) {
    data.staff = false;
  }
  if ($("#user-list-admins-yes").is(":checked")) {
    data.admin = true;
  }
  else if ($("#user-list-admins-no").is(":checked")) {
    data.admin = false;
  }
  if ($("#user-list-global-mods-yes").is(":checked")) {
    data.global_mod = true;
  }
  else if ($("#user-list-global-mods-no").is(":checked")) {
    data.global_mod = false;
  }
  if ($("#user-list-ama-yes").is(":checked")) {
    data.ama = true;
  }
  else if ($("#user-list-ama-no").is(":checked")) {
    data.ama = false;
  }
  if ($("#user-list-streamer-gaming-yes").is(":checked")) {
    data.streamer_gaming = true;
  }
  else if ($("#user-list-streamer-gaming-no").is(":checked")) {
    data.streamer_gaming = false;
  }
  if ($("#user-list-streamer-creative-yes").is(":checked")) {
    data.streamer_creative = true;
  }
  else if ($("#user-list-streamer-creative-no").is(":checked")) {
    data.streamer_creative = false;
  }
  if ($("#user-list-streamer-irl-yes").is(":checked")) {
    data.streamer_irl = true;
  }
  else if ($("#user-list-streamer-irl-no").is(":checked")) {
    data.streamer_irl = false;
  }
  if ($("#user-list-streamer-socialeating-yes").is(":checked")) {
    data.streamer_socialeating = true;
  }
  else if ($("#user-list-streamer-socialeating-no").is(":checked")) {
    data.streamer_socialeating = false;
  }
  if ($("#user-list-streamer-talkshow-yes").is(":checked")) {
    data.streamer_talkshow = true;
  }
  else if ($("#user-list-streamer-talkshow-no").is(":checked")) {
    data.streamer_talkshow = false;
  }
  if ($("#user-list-streamer-music-yes").is(":checked")) {
    data.streamer_music = true;
  }
  else if ($("#user-list-streamer-music-no").is(":checked")) {
    data.streamer_music = false;
  }
  if ($("#user-list-artist-yes").is(":checked")) {
    data.artist = true;
  }
  else if ($("#user-list-artist-no").is(":checked")) {
    data.artist = false;
  }
  if ($("#user-list-developer-yes").is(":checked")) {
    data.developer = true;
  }
  else if ($("#user-list-developer-no").is(":checked")) {
    data.developer = false;
  }
  if ($("#user-list-communitymanager-yes").is(":checked")) {
    data.communitymanager = true;
  }
  else if ($("#user-list-communitymanager-no").is(":checked")) {
    data.communitymanager = false;
  }
  if ($("#user-list-moderator-yes").is(":checked")) {
    data.moderator = true;
  }
  else if ($("#user-list-moderator-no").is(":checked")) {
    data.moderator = false;
  }
  if ($("#user-list-viewer-yes").is(":checked")) {
    data.viewer = true;
  }
  else if ($("#user-list-viewer-no").is(":checked")) {
    data.viewer = false;
  }
  if ($("#user-list-other-yes").is(":checked")) {
    data.other = true;
  }
  else if ($("#user-list-other-no").is(":checked")) {
    data.other = false;
  }
  if ($("#user-list-profile-pending").is(":checked")) {
    data.profile = "pending";
  }
  else if ($("#user-list-profile-approved").is(":checked")) {
    data.profile = "approved";
  }
  else if ($("#user-list-profile-rejected").is(":checked")) {
    data.profile = "rejected";
  }
  else if ($("#user-list-profile-no").is(":checked")) {
    data.profile = "missing";
  }
  if ($("#user-list-twoos-more").is(":checked")) {
    data.twoos = "more";
  }
  else if ($("#user-list-twoos-less").is(":checked")) {
    data.twoos = "less";
  }
  else if ($("#user-list-twoos-exact").is(":checked")) {
    data.twoos = "exact";
  }
  data.twoos_value = $("#user-list-twoos-value").val();
  if ((data.twoos && data.twoos_value == "") || (data.twoos && data.twoos_value < 0)) {
    Materialize.toast("You must enter a valid Twoos value.", 4000, "rounded");
  }
  else if (Object.keys(data).length < 3) {
    Materialize.toast("You must enter a search query.", 4000, "rounded");
  }
  else {
    $.post("/admin/accounts/list", data, function(data) {
      if (data.message == "not_found") {
        Materialize.toast("There we no results found.", 4000, "rounded");
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that.", 4000, "rounded");
      }
      else if (data.message == "unknown") {
        Materialize.toast("An unknown error occurred.", 4000, "rounded");
      }
      else {
        $("#user-list-result table tbody").html(data);
        $("#user-list-generate").slideUp();
        $("#user-list-result").slideDown();
      }
    });
  }
});
