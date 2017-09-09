$(document).delegate("#admin-approve", "click", function() {
  var id = $(this).data("id"),
      username = $(this).data("username");

  $.post("/admin/profiles/approve", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#profile-" + id).slideUp();
      if (username.slice(-1) == "s") {
        var possession = "'";
      }
      else {
        var possession = "'s";
      }
      Materialize.toast(username + possession + " profile has been approved.", 4000, "rounded");
    }
    else if (data.message == "not_found") {
      Materialize.toast("That user does not appear to exist.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#admin-reject", "click", function() {
  var id = $(this).data("id"),
      username = $(this).data("username"),
      reason = $(this).data("tooltip").replace("Reject: ", "");

  $.post("/admin/profiles/reject", {
    id: id,
    reason: reason
  }, function(data) {
    if (data.message == "success") {
      $("#profile-" + id).slideUp();
      if (username.slice(-1) == "s") {
        var possession = "'";
      }
      else {
        var possession = "'s";
      }
      Materialize.toast(username + possession + " profile has been rejected.", 4000, "rounded");
    }
    else if (data.message == "not_found") {
      Materialize.toast("That user does not appear to exist.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
