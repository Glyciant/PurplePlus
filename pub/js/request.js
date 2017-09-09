$(document).delegate("#request-comment-submit", "click", function() {
  var comment = $("#request-new-comment").val(),
      id = $(this).data("id"),
      twitch = $(this).data("twitch");

  if (!comment) {
    Materialize.toast('You have not written a comment.', 4000, 'rounded');
    return;
  }

  if (!id || !twitch) {
    Materialize.toast('An unknown error occurred.', 4000, 'rounded');
    return;
  }

  var type;

  if ($("#request-comment-type-public").is(":checked")) {
    type = "public";
  }
  else {
    type = "private";
  }

  $.post("/requests/comment/add", {
    id: id,
    twitch: twitch,
    comment: comment,
    type: type
  }, function(data) {
    if (data.message == "success") {
      $("#request-new-comment").val("");
      var d = new Date(),
          converter = new showdown.Converter();
      $("#request-no-comments").remove();
      $("#request-comments-wrapper").append('<div class="row"><div class="col s8"><h5>' + data.submitter + '</h5></div><div class="col s4"><h6 class="right"><strong style="text-transform: capitalize;">' + d.getDate()  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + ' - ' + type + '</strong></h6></div><div class="col s12"><p>' + converter.makeHtml(comment) + '</p></div></div>');
      Materialize.toast("The comment was submitted.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#request-status-save", "click", function() {
  var status = $("#request-new-status select").val(),
      id = $(this).data("id"),
      twitch = $(this).data("twitch");

  if (!status) {
    Materialize.toast('You have not selected a status.', 4000, 'rounded');
    return;
  }

  if (!id || !twitch) {
    Materialize.toast('An unknown error occurred.', 4000, 'rounded');
    return;
  }

  $.post("/admin/requests/status/update", {
    id: id,
    twitch: twitch,
    status: status
  }, function(data) {
    if (data.message == "success") {
      $("#request-status-wrapper").html("");
      if (status == "approved") {
        $("#request-status-wrapper").append('<a class="btn waves-effect waves-green green darken-2 white-text" style="cursor: default;">Approved</a>');
      }
      else if (status == "rejected") {
        $("#request-status-wrapper").append('<a class="btn waves-effect waves-red red darken-2 white-text" style="cursor: default;">Rejected</a>');
      }
      else {
        $("#request-status-wrapper").append('<a class="btn waves-effect waves-orange orange darken-2 white-text" style="cursor: default;">Pending</a>');
      }
      Materialize.toast("The status was updated.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#request-withdraw, #request-reopen", "click", function() {
  var id = $(this).data("id"),
      twitch = $(this).data("twitch");

  if (!id || !twitch) {
    Materialize.toast('An unknown error occurred.', 4000, 'rounded');
    return;
  }

  $.post("/requests/status/withdraw", {
    id: id,
    twitch: twitch,
  }, function(data) {
    if (data.message == "success") {
      $("#request-status-wrapper").html("");
      if (data.status == "withdrawn") {
        $("#request-withdraw-wrapper td:nth-of-type(1)").html("Reopen Request:");
        $("#request-withdraw-wrapper td:nth-of-type(2)").html('<a href="#!" class="btn waves-effect waves-black deep-purple darken-2 white-text" id="request-reopen" data-id="' + id + '" data-twitch="' + twitch + '">Reopen</a>')//
        $("#request-status-wrapper").append('<a class="btn waves-effect waves-black black darken-2 white-text" style="cursor: default;">Withdrawn</a>');
      }
      else {
        $("#request-withdraw-wrapper td:nth-of-type(1)").html("Withdraw Request:");
        $("#request-withdraw-wrapper td:nth-of-type(2)").html('<a href="#!" class="btn waves-effect waves-black black white-text" id="request-withdraw"  data-id="' + id + '" data-twitch="' + twitch + '">Withdraw</a>')//
        $("#request-status-wrapper").append('<a class="btn waves-effect waves-orange orange darken-2 white-text" style="cursor: default;">Pending</a>');
      }
      Materialize.toast("The status was updated.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#request-upvote", "click", function() {
  var id = $(this).data("id"),
      twitch = $(this).data("twitch");

  if (!id || !twitch) {
    Materialize.toast('An unknown error occurred.', 4000, 'rounded');
    return;
  }

  $.post("/admin/requests/vote/approve", {
    id: id,
    twitch: twitch,
  }, function(data) {
    if (data.message == "success") {
      $("#request-yes-votes").html(data.upvotes);
      $("#request-no-votes").html(data.downvotes);
      $("#request-upvote").addClass("disabled");
      $("#request-downvote").removeClass("disabled");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#request-downvote", "click", function() {
  var id = $(this).data("id"),
      twitch = $(this).data("twitch");

  if (!id || !twitch) {
    Materialize.toast('An unknown error occurred.', 4000, 'rounded');
    return;
  }

  $.post("/admin/requests/vote/reject", {
    id: id,
    twitch: twitch,
  }, function(data) {
    if (data.message == "success") {
      $("#request-yes-votes").html(data.upvotes);
      $("#request-no-votes").html(data.downvotes);
      $("#request-upvote").removeClass("disabled");
      $("#request-downvote").addClass("disabled");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
