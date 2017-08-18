$(document).ready(function() {
  $.post("/browse/home/viewing/profiles", {
    init: true
  }, function(data) {
    $("#tab-viewing-profiles").html(data);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });
  $.post("/browse/home/viewing/streams", {
    init: true
  }, function(data) {
    $("#tab-viewing-streams").html(data);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });
  $.post("/browse/home/collaborations/profiles", {
    init: true
  }, function(data) {
    $("#tab-collaborations-profiles").html(data);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });
  $.post("/browse/home/collaborations/streams", {
    init: true
  }, function(data) {
    $("#tab-collaborations-streams").html(data);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });
});

$(document).delegate(window, "scroll", function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    $(window).unbind("scroll");
    if ($("#tab-viewing-profiles").is(".active")) {
      var ids = $("#tab-viewing-profiles .card").map(function() {
        return $(this).data("id");
      }).get();
      $.post("/browse/home/viewing/profiles", {
        ids: ids
      }, function(data) {
        $("#tab-viewing-profiles").append(data);
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip({delay: 50});
      });
    }
    if ($("#tab-viewing-streams").is(".active")) {
      var ids = $("#tab-viewing-streams .card").map(function() {
        return $(this).data("id");
      }).get();
      $.post("/browse/home/viewing/streams", {
        ids: ids
      }, function(data) {
        $("#tab-viewing-streams").append(data);
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip({delay: 50});
      });
    }
    if ($("#tab-collaborations-profiles").is(".active")) {
      var ids = $("#tab-collaborations-profiles .card").map(function() {
        return $(this).data("id");
      }).get();
      $.post("/browse/home/collaborations/profiles", {
        ids: ids
      }, function(data) {
        $("#tab-collaborations-profiles").append(data);
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip({delay: 50});
      });
    }
    if ($("#tab-collaborations-streams").is(".active")) {
      var ids = $("#tab-collaborations-streams .card").map(function() {
        return $(this).data("id");
      }).get();
      $.post("/browse/home/collaborations/streams", {
        ids: ids
      }, function(data) {
        $("#tab-collaborations-streams").append(data);
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip({delay: 50});
      });
    }
  }
});
