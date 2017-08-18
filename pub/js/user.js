$(document).ready(function() {
  var height = $("body").height();
  $("#profile-stream").css("height", height - 425 + "px");
});

$(document).delegate("#upvote-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/upvote", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#profile-votes").html(parseInt($("#profile-votes").html()) + 1);
      $(".material-tooltip").remove();
      $("#vote-profile-wrapper").html('<a class="btn-floating btn-large waves-effect waves-light custom darken-1 tooltipped" id="downvote-profile" data-position="left" data-delay="50" data-tooltip="Downvote Profile" data-id="' + id +'" style="margin: 2.5px 0;"><i class="material-icons">arrow_downward</i></a>');
      $('.tooltipped').tooltip({delay: 50});
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#downvote-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/downvote", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#profile-votes").html(parseInt($("#profile-votes").html()) - 1);
      $(".material-tooltip").remove();
      $("#vote-profile-wrapper").html('<a class="btn-floating btn-large waves-effect waves-light custom darken-1 tooltipped" id="upvote-profile" data-position="left" data-delay="50" data-tooltip="Upvote Profile" data-id="' + id +'" style="margin: 2.5px 0;"><i class="material-icons">arrow_upward</i></a>');
      $('.tooltipped').tooltip({delay: 50});
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#bookmark-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/bookmark", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $(".material-tooltip").remove();
      $("#bookmark-profile-wrapper").html('<a class="btn-floating btn-large waves-effect waves-light custom darken-1 tooltipped" id="unbookmark-profile" data-position="left" data-delay="50" data-tooltip="Delete Bookmark" data-id="' + id +'" style="margin: 2.5px 0;"><i class="material-icons">delete</i></a>');
      $('.tooltipped').tooltip({delay: 50});
      Materialize.toast("The bookmark was added successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#unbookmark-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/unbookmark", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $(".material-tooltip").remove();
      $("#bookmark-profile-wrapper").html('<a class="btn-floating btn-large waves-effect waves-light custom darken-1 tooltipped" id="bookmark-profile" data-position="left" data-delay="50" data-tooltip="Add Bookmark" data-id="' + id +'" style="margin: 2.5px 0;"><i class="material-icons">star</i></a>');
      $('.tooltipped').tooltip({delay: 50});
      Materialize.toast("The bookmark was deleted successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#profile-edit-note", "click", function() {
  var id = $(this).data("id"),
      note = $("#profile-note").val();

  $.post("/user/note", {
    id: id,
    note: note
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The note was saved successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  })
});

$(document).delegate("#profile-data", "click", function() {
  if (!$("#profile-data .active").html()) {
    $("#profile-data li:nth-of-type(1)").addClass("active");
    $("#profile-data li:nth-of-type(1) div:nth-of-type(1)").addClass("active");
    $('.collapsible').collapsible();
  }
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
