$(document).delegate("#link-accounts", "click", function() {
  $("#profile-wrapper").slideUp();
  $("#no-profile").slideUp();
  $("#profile-settings-wrapper #profile-edit-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-edit-wrapper").slideUp();
  $("#profile-settings-wrapper").slideUp();
  $("#profile-mobile-settings").slideUp();
  $("#profile-requests-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-requests-wrapper").slideUp();
  $("#link-accounts-wrapper").slideDown();
  $("#profile-return-wrapper").slideDown();
  $("#profile-mobile-settings-wrapper #profile-return-wrapper").slideDown();
});

$(document).delegate("#profile-return-wrapper a", "click", function() {
  $("#link-accounts-wrapper").slideUp();
  $("#profile-return-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-return-wrapper").slideUp();
  $("#profile-mobile-settings-wrapper #profile-edit-wrapper").slideUp();
  $("#profile-wrapper").slideDown();
  $("#no-profile").slideDown();
  $("#profile-edit-wrapper").slideDown();
  $("#profile-settings-wrapper").slideDown();
  $("#profile-mobile-settings").slideDown();
  $("#profile-requests-wrapper").slideDown();
  $("#profile-mobile-settings-wrapper #profile-requests-wrapper").slideDown();
});
