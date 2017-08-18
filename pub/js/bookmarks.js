$(document).ready(function() {
  $.post("/browse/bookmarks/search", function(data) {
    if (data.trim()) {
      $("#bookmarks").append(data);
      $('.tooltipped').tooltip({delay: 50});
    }
    else {
      $.post("/missing/", {
        message: "You do not have any bookmarks."
      }, function(data) {
        $("#bookmarks").html(data);
        $("#bookmarks").attr("style", "");
      });
    }
  });
});

$(document).delegate("#twitch-username", "keyup", function() {
  var query = $(this).val();

  $("#bookmarks").html("");
  $.post("/browse/bookmarks/search", {
    query: query
  }, function(data) {
    $("#bookmarks").append(data);
    $('.tooltipped').tooltip({delay: 50});
  });
});

$(document).delegate("#unbookmark-profile", "click", function() {
  var id = $(this).data("id");

  $.post("/user/unbookmark", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $(".material-tooltip").remove();
      $("#bookmark-" + id).parent().addClass("removed");
      $("#bookmark-" + id + " a").attr("href", "#!");
      $("#bookmark-" + id + " a").css("cursor", "default");
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
