// TODO: Make First Section Variable
$(document).ready(function() {
    var id = $("#content-wrapper").data("twitch-id");

    $.post("/user/content/body", {
        id: id
    }, function(resp) {
        $("#content-wrapper").html(resp);
    });
});