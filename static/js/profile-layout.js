// TODO: Make First Section Variable
$(document).ready(function() {
    var id = $("#content-wrapper").data("twitch-id");

    $.post("/profile/content/body", {
        id: id
    }, function(resp) {
        $("#content-wrapper").html(resp);
    });
});