$(document).delegate("#search", "click", function() {
  var channel = $("#search-channel select").val(),
      user = $("#search-user").val(),
      results = $("#search-results").val();

  $.post("/admin/discord/logs/", {
    channel: channel,
    user: user,
    results: results,
    response: "table"
  }, function(data) {
    $("#logs-table").slideUp("fast", function() {
      $(".modal").remove();
      $(".lean-overlay").remove();
      if (data.message == "not_found") {
        Materialize.toast("There were no results found.", 4000, "rounded");
      }
      else if (data.message == "forbidden") {
        Materialize.toast("You do not have permission to do that.", 4000, "rounded");
      }
      else if (data.message == "unknown") {
        Materialize.toast("An unknown error occurred.", 4000, "rounded");
      }
      else {
        $("#logs-table table tbody").html("");
        $("#logs-table table tbody").append(data);
        $.post("/admin/discord/logs/", {
          channel: channel,
          user: user,
          results: results,
          response: "modal"
        }, function(data) {
          $("body").append(data);
          $('.modal').modal();
          $("#logs-table").slideDown("fast");
        });
      }
    });
  });
});
