// Moderation Log - Continuous Scrolling
$('#content-wrapper').on('scroll', function() {
    // Wait for Scroll to Bottom of Page
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        // Make Request to Server
        $.post("/admin/get/administration/log", {
            after: $("#logs tr").length
        }, function(resp) {
            // Render HTML
            $("#logs").append(resp);
        });
    }
});