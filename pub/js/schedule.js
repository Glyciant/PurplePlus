$(document).ready(function() {
  var d = new Date(),
  timezone = d.toLocaleString('en', { timeZoneName:'short' }).split(' ').pop();
  $('[id="timezone"]').html(timezone);
  $('[id="start"], [id="end"]').each(function() {
    var d = new Date(parseInt($(this).data("utc")));
    $(this).html(("0" + d.getDate()).slice(-2)  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
  });
  $('[id="header"]').each(function() {
    var d = new Date(parseInt($(this).data("utc")));
    $(this).html(d.toLocaleString('en', { hour: "numeric", minute: "numeric", hour12: true }));
  });
});

$(document).delegate("#scroll", "click", function() {
  var start = $(this).data("utc");

  $.post("/browse/schedule/header", {
    start: start
  }, function(data) {
    $("#times").html(data);
    $('[id="header"]').each(function() {
      var d = new Date(parseInt($(this).data("utc")));
      $(this).html(d.toLocaleString('en', { hour: "numeric", minute: "numeric", hour12: true }));
    });
    var ids = $("#users .row").map(function() {
      return $(this).data("id");
    }).get();
    $.post("/browse/schedule/streams", {
      start: start,
      method: "scroll",
      ids: ids
    }, function(data) {
      $("#users").html(data);
      var d = new Date(),
      timezone = d.toLocaleString('en', { timeZoneName:'short' }).split(' ').pop();
      $('[id="timezone"]').html(timezone);
      $('[id="start"], [id="end"]').each(function() {
        var d = new Date(parseInt($(this).data("utc")));
        $(this).html(("0" + d.getDate()).slice(-2)  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
      });
      $('.modal').modal();
      $('.tooltipped').tooltip({delay: 50});
    });
  });
});

$(document).delegate("#search", "keyup", function() {
  var start = $(this).data("utc"),
      query = $(this).val();

  $.post("/browse/schedule/streams", {
    start: start,
    method: "query",
    query: query
  }, function(data) {
    $("#users").html(data);
    var d = new Date(),
    timezone = d.toLocaleString('en', { timeZoneName:'short' }).split(' ').pop();
    $('[id="timezone"]').html(timezone);
    $('[id="start"], [id="end"]').each(function() {
      var d = new Date(parseInt($(this).data("utc")));
      $(this).html(("0" + d.getDate()).slice(-2)  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes());
    });
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 50});
  });
});
