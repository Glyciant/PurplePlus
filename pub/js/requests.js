$(document).ready(function() {
  if ($("#requests-wrapper").html().trim() == "") {
    $.post("/missing/", {
      message: "There are no approved requests to show."
    }, function(data) {
      $("#requests-wrapper").html(data);
      $("#requests-wrapper").attr("style", "");
    });
  }
});
