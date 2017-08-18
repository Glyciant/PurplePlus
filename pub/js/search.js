$(document).ready(function() {
  $.post("/browse/search/search", {
    init: true
  }, function(data) {
    $("#results").append(data);
    $('.tooltipped').tooltip({delay: 50});
  });
});

$(document).delegate("#twitch-username", "keyup", function() {
  var query = $(this).val();

  $("#results").html("");
  $.post("/browse/search/search", {
    query: query
  }, function(data) {
    $("#results").append(data);
    $('.tooltipped').tooltip({delay: 50});
  });
});

$(document).delegate(window, "scroll", function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    $(window).unbind("scroll");
    var offset,
        ids = $("#results .card").map(function() {
          return $(this).data("id");
        }).get(),
        query = $("#twitch-username").val();
    $.post("/browse/search/search", {
      query: query,
      ids: ids.join()
    }, function(data) {
      $("#results").append(data);
      $('.tooltipped').tooltip({delay: 50});
    });
  }
});

$(document).delegate("#search-preview-stream", "click", function() {
  var name = $(this).data("name");
  $("#modal-stream .modal-content").html('<iframe src="http://player.twitch.tv/?channel=' + name + '"height="100%" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>');
  $("#modal-stream #preview-profile").prop("href", "/user/" + name);
});

$(document).delegate(".modal-overlay", "click", function() {
  $("#modal-stream .modal-content").html('');
  $("#modal-stream #preview-profile").prop("href", "");
});
