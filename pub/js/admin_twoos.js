$(document).delegate("#approve-nomination", "click", function() {
  var id = $(this).data("id"),
      reddit = $(this).data("reddit");

  $.post("/admin/twoos/approve", {
    id: id,
    reddit: reddit
  }, function(data) {
    if (data.message == "success") {
      $("#nomination-" + id + "-wrapper").slideUp();
      Materialize.toast("The nomination was approved successfully.", 4000, "rounded");
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

$(document).delegate("#reject-nomination", "click", function() {
  var id = $(this).data("id"),
      reddit = $(this).data("reddit");

  $.post("/admin/twoos/reject", {
    id: id,
    reddit: reddit
  }, function(data) {
    if (data.message == "success") {
      $("#nomination-" + id + "-wrapper").slideUp();
      Materialize.toast("The nomination was rejected successfully.", 4000, "rounded");
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

$(document).delegate("#search-transactions", "click", function() {
  var reddit = $("#search-transactions-reddit-username").val(),
      twitch = $("#search-transactions-twitch-username").val(),
      discord = $("#search-transactions-discord-id").val(),
      id = $("#search-transactions-id").val();

  if (reddit || twitch || discord || id) {
    $.post("/admin/twoos/transactions", {
      reddit: reddit,
      twitch: twitch,
      discord: discord,
      id: id,
      response: "table"
    }, function(data) {
      if (data.message == "not_found") {
        Materialize.toast("There were no results found.", 4000, "rounded");
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
      }
      else if (data.message == "unknown") {
        Materialize.toast("An unknown error occurred.", 4000, "rounded");
      }
      else {
        $("#search-transactions-data").slideUp("fast", function() {
          $("#search-transactions-data table #results").html("");
          $("#search-transactions-data table #results").append(data);
          $.post("/admin/twoos/transactions", {
            reddit: reddit,
            twitch: twitch,
            discord: discord,
            id: id,
            response: "modal"
          }, function(data) {
            $("#search-transactions-data").append(data);
            $('.modal').modal();
            $("#search-transactions-data").slideDown("fast");
          });
        });
      }
    });
  }
  else {
    Materialize.toast("You have not filled in any search fields.", 4000, "rounded");
  }
});

$(document).delegate("#search-nominations", "click", function() {
  var reddit = $("#search-nominations-reddit-username").val(),
      twitch = $("#search-nominations-twitch-username").val(),
      discord = $("#search-nominations-discord-id").val(),
      id = $("#search-nominations-id").val(),
      url = $("#search-nominations-url").val(),
      status = $("#search-nominations-status select").val();

  if (reddit || twitch || discord || id || url || status) {
    $.post("/admin/twoos/nominations", {
      reddit: reddit,
      twitch: twitch,
      discord: discord,
      id: id,
      url: url,
      status: status,
      response: "table"
    }, function(data) {
      if (data.message == "not_found") {
        Materialize.toast("There were no results found.", 4000, "rounded");
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
      }
      else if (data.message == "unknown") {
        Materialize.toast("An unknown error occurred.", 4000, "rounded");
      }
      else {
        $("#search-nominations-data").slideUp("fast", function() {
          $("#search-nominations-data table tbody").html("");
          $("#search-nominations-data table tbody").append(data);
          $.post("/admin/twoos/nominations", {
            reddit: reddit,
            twitch: twitch,
            discord: discord,
            id: id,
            url: url,
            status: status,
            response: "modal"
          }, function(data) {
            $("#search-nominations-data").append(data);
            $('.modal').modal();
            $("#search-nominations-data").slideDown("fast");
          });
        });
      }
    });
  }
  else {
    Materialize.toast("You have not filled in any search fields.", 4000, "rounded");
  }
});

$(document).delegate("#edit-nomination-status", "click", function() {
  var id = $(this).data("id"),
      reddit = $(this).data("reddit"),
      action = $(this).data("action");

  if (action == "approve") {
    $("#modal-admin-nomination-" + id + " #admin-transaction-" + id + "-action").html("reject");
    $(this).data("action", "reject");
    $("#nomination-" + id + "-status-wrapper").html('<a href="#modal-admin-nomination-' + id + '" class="btn waves-effect waves-green green darken-2 white-text" width: 100%;">Approved</a>');
    $.post("/admin/twoos/reapprove", {
      id: id,
      reddit: reddit
    }, function(data) {
      if (data.message == "success") {
        $("#nomination-" + id + "-wrapper").slideUp();
        Materialize.toast("The nomination was approved successfully.", 4000, "rounded");
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
  }
  else if (action == "reject") {
    $("#modal-admin-nomination-" + id + " #admin-transaction-" + id + "-action").html("approve");
    $(this).data("action", "approve");
    $("#nomination-" + id + "-status-wrapper").html('<a href="#modal-admin-nomination-' + id + '" class="btn waves-effect waves-red red darken-2 white-text" width: 100%;">Rejected</a>');
    $.post("/admin/twoos/reject", {
      id: id,
      reddit: reddit
    }, function(data) {
      if (data.message == "success") {
        $("#nomination-" + id + "-wrapper").slideUp();
        Materialize.toast("The nomination was rejected successfully.", 4000, "rounded");
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
  }
  else {
    Materialize.toast("An unknown error occurred.", 4000, "rounded");
  }
});

$(document).ready(function() {
  if ($("#tab-pending>.col").html().trim() == "") {
    $.post("/missing/", {
      message: "There are no pending nominations."
    }, function(data) {
      $("#tab-pending>.col").html(data);
      $("#tab-pending>.col").attr("style", "");
    });
  }
});
