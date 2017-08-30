$(document).delegate("#twoos-transactions", "click", function() {
  $("#profile-wrapper").slideUp();
  $("#no-profile").slideUp();
  $("#profile-edit-wrapper").slideUp();
  $("#profile-settings-wrapper").slideUp();
  $("#profile-view-wrapper").slideUp();
  $("#profile-mobile-settings").slideUp();
  $("#profile-requests-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-requests-wrapper").slideUp();
  $("#twoos-transactions-wrapper").slideDown();
  $("#profile-return-wrapper").slideDown();
  $("#profile-mobile-settings-wrapper #profile-return-wrapper").slideDown();
});

$(document).delegate("#profile-return-wrapper a", "click", function() {
  $("#twoos-transactions-wrapper").slideUp();
  $("#profile-return-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-return-wrapper").slideUp();
  $("#profile-wrapper").slideDown();
  $("#no-profile").slideDown();
  $("#profile-edit-wrapper").slideDown();
  $("#profile-settings-wrapper").slideDown();
  $("#profile-view-wrapper").slideDown();
  $("#profile-mobile-settings").slideDown();
  $("#profile-requests-wrapper").slideDown();
  $("#profile-mobile-settings-wrapper #profile-requests-wrapper").slideDown();
});

$(document).delegate("#collapsible-transactions", "click", function() {
  var id = $(this).data("id"),
      length = $(this).data("length");

  if ($(this).data("selected") == "true") {
    $(this).html("Show " + length);
    $(this).data("selected", "false");
    $(".group-data-" + id).hide();
  }
  else {
    $(this).html("Hide " + length);
    $(this).data("selected", "true");
    $(".group-data-" + id).show();
  }
});
