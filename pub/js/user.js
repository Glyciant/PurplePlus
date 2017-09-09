$(document).ready(function() {
  var height = $("body").height();
  $("#profile-stream").css("height", height - 425 + "px");
  var d = new Date(),
      timezone = d.toLocaleString('en', { timeZoneName:'short' }).split(' ').pop();
  $('[id="timezone"]').html(timezone);
  $('[id="start"], [id="end"]').each(function() {
    var d = new Date(parseInt($(this).data("utc")));
    $(this).html(("0" + d.getDate()).slice(-2)  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
  });
});

$(document).delegate("#upvote-profile, #mobile-upvote-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/upvote", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#profile-votes").html(parseInt($("#profile-votes").html()) + 1);
      $(".material-tooltip").remove();
      $('.fixed-action-btn').closeFAB();
      $("#upvote-profile").replaceWith('<a class="btn-floating waves-effect waves-light custom darken-1 tooltipped" id="downvote-profile" data-position="left" data-delay="50" data-tooltip="Downvote Profile" data-id="' + id +'"><i class="material-icons">arrow_downward</i></a>');
      $("#mobile-upvote-profile").replaceWith('<a href="#!" class="btn waves-effect waves-light custom darken-1 tooltipped" id="mobile-downvote-profile" data-position="top" data-delay="50" data-tooltip="Downvote Profile" data-id="' + id + '"><i class="material-icons">arrow_downward</i></a>');
      $('.tooltipped').tooltip({delay: 50});
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#downvote-profile, #mobile-downvote-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/downvote", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#profile-votes").html(parseInt($("#profile-votes").html()) - 1);
      $(".material-tooltip").remove();
      $('.fixed-action-btn').closeFAB();
      $("#downvote-profile").replaceWith('<a class="btn-floating waves-effect waves-light custom darken-1 tooltipped" id="upvote-profile" data-position="left" data-delay="50" data-tooltip="Upvote Profile" data-id="' + id +'"><i class="material-icons">arrow_upward</i></a>');
      $("#mobile-downvote-profile").replaceWith('<a href="#!" class="btn waves-effect waves-light custom darken-1 tooltipped" id="mobile-upvote-profile" data-position="top" data-delay="50" data-tooltip="Upvote Profile" data-id="' + id + '"><i class="material-icons">arrow_upward</i></a>');
      $('.tooltipped').tooltip({delay: 50});
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#bookmark-profile, #mobile-bookmark-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/bookmark", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $(".material-tooltip").remove();
      $('.fixed-action-btn').closeFAB();
      $("#bookmark-profile").replaceWith('<a class="btn-floating waves-effect waves-light custom darken-1 tooltipped" id="unbookmark-profile" data-position="left" data-delay="50" data-tooltip="Delete Bookmark" data-id="' + id +'"><i class="material-icons">delete</i></a>');
      $("#mobile-bookmark-profile").replaceWith('<a href="#!" class="btn waves-effect waves-light custom darken-1 tooltipped" id="mobile-unbookmark-profile" data-position="top" data-delay="50" data-tooltip="Delete Bookmark" data-id="' + id + '"><i class="material-icons">delete</i></a>');
      $('.tooltipped').tooltip({delay: 50});
      Materialize.toast("The bookmark was added successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#unbookmark-profile, #mobile-unbookmark-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/unbookmark", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $(".material-tooltip").remove();
      $('.fixed-action-btn').closeFAB();
      $("#unbookmark-profile").replaceWith('<a class="btn-floating waves-effect waves-light custom darken-1 tooltipped" id="bookmark-profile" data-position="left" data-delay="50" data-tooltip="Add Bookmark" data-id="' + id +'"><i class="material-icons">add</i></a>');
      $("#mobile-unbookmark-profile").replaceWith('<a href="#!" class="btn waves-effect waves-light custom darken-1 tooltipped" id="mobile-bookmark-profile" data-position="top" data-delay="50" data-tooltip="Add Bookmark" data-id="' + id + '"><i class="material-icons">add</i></a>');
      $('.tooltipped').tooltip({delay: 50});
      Materialize.toast("The bookmark was deleted successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
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
      location.reload();
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that. If you think this is an error, please try again later.", 4000, "rounded");
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
