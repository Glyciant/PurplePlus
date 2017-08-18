$(document).ready(function() {
  setTimeout(function() {
    $("#surf-automatic-message").show("slide", { direction: "left" }, 500);
    var interval = setInterval(function() {
      $("#surf-automatic-message-time").html(parseInt($("#surf-automatic-message-time").html()) - 1);
    }, 1000);
    var timeout = setTimeout(function() {
      location.reload();
    }, 60000);
    $(document).delegate("#surf-automatic-message", "click", function() {
      clearTimeout(timeout);
      clearInterval(interval);
      $("#surf-automatic-message").hide("slide", { direction: "left" }, 500);
    });
  }, 300000);
});
