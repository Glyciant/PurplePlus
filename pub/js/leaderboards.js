$(document).delegate(window, "scroll", function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    $(window).unbind("scroll");
    var offset;
    if ($("#twoos-leaderboard").is(".active")) {
      offset = $("#twoos-leaderboard table tbody tr").size();
      $.post("/browse/leaderboards/twoos", {
        offset: offset
      }, function(data) {
        $("#twoos-leaderboard table tbody").append(data);
      });
    }
    else if ($("#votes-leaderboard").is(".active")) {
      offset = $("#votes-leaderboard table tbody tr").size(),
      ids = $("#votes-leaderboard table tbody tr").map(function() {
        return $(this).data("id");
      }).get();
      $.post("/browse/leaderboards/votes", {
        offset: offset,
        ids: ids.join()
      }, function(data) {
        $("#votes-leaderboard table tbody").append(data);
      });
    }
  }
});
