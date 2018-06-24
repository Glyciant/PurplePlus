// Bookmarks - Continuous Scrolling
$('#content-wrapper').on('scroll', function() {
    // Wait for Scroll to Bottom of Page
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        $.post("/dashboard/get/profiles", {
            type: "bookmarks",
            after: $("#bookmarks div").length
        }, function(resp) {
            $("#bookmarks").append(resp);
        });
    }
});

// Ratings - Continuous Scrolling
$('#content-wrapper').on('scroll', function() {
    // Wait for Scroll to Bottom of Page
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        $.post("/dashboard/get/profiles", {
            type: "ratings",
            after: $("#ratings div").length
        }, function(resp) {
            $("#ratings").append(resp);
        });
    }
});