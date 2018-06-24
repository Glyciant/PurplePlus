// Profile Ratings - Light Up Stars
$(document).delegate("#modal-rate .row a", "click", function() {
    // Get Rating Group & Value Selected
    var group = $(this).data("group"),
        value = parseInt($(this).data("value"));

    // Loop Through Each Star in Group
    $("a[data-group=\"" + group + "\"").each(function() {
        // Select Colour of Star
        if (parseInt($(this).data("value")) < value) {
            // Make Star Yellow
            $(this).removeClass("grey-text");
            $(this).addClass("yellow-text");
            // Remove Active Attribute
            $(this).removeClass("active", "");
        }
        else if (parseInt($(this).data("value")) === value) {
            // Make Star Yellow
            $(this).removeClass("grey-text");
            $(this).addClass("yellow-text");
            // Add Active Attribute
            $(this).addClass("active", "true");
        }
        else {
            // Make Star Grey
            $(this).removeClass("yellow-text");
            $(this).addClass("grey-text");
            // Remove Active Attribute
            $(this).removeClass("active", "");
        }
    });
});

// Profile Ratings - Clear
$(document).delegate("#rate-clear", "click", function() {
    // Make All Stars Grey
    $("#modal-rate .row a").removeClass("yellow-text");
    $("#modal-rate .row a").addClass("grey-text");
    // Remoev All Active Attributes
    $("#modal-rate .row a").removeClass("active");
});

// Profile Ratings - Submit
$(document).delegate("#rate-submit", "click", function() {
    // Get Profile ID & Ratings
    var id = $(this).data("id"),
        general = parseInt($("#rate-general .active").data("value")),
        quality = parseInt($("#rate-quality .active").data("value")),
        humour = parseInt($("#rate-humour .active").data("value")),
        uniqueness = parseInt($("#rate-uniqueness .active").data("value"));

    // Check That All Categories Have a Rating or if Rating has Been Deleted
    if (general && quality && humour && uniqueness) {
        // Make Request to Server
        $.post("/user/interact/ratings/submit", {
            id: id,
            general: general,
            quality: quality,
            humour: humour,
            uniqueness: uniqueness
        }, function(resp) {
            if (resp.status === 200) {
                // Close Modal
                $(".modal").modal("close");
                // Display Success Message
                 M.toast({
                    html: "Your rating has been saved.",
                    classes: "rounded"
                });
            }
            else if (resp.status === 401) {
                // Display Error Message
                 M.toast({
                    html: "You do not have permission to do that.",
                    classes: "rounded"
                });
            }
            else if (resp.status === 403) {
                // Display Error Message
                M.toast({
                    html: "You do not appear to be logged in.",
                    classes: "rounded"
                });
            }
            else {
                // Display Error Message
                M.toast({
                    html: "An unknown error occurred.",
                    classes: "rounded"
                });
            }
        });    
    }
    else if (!general && !quality && !humour && !uniqueness) {
        // Make Request to Server
        $.post("/user/interact/ratings/delete", {
            id: id
        }, function(resp) {
            if (resp.status === 200) {
                // Close Modal
                $(".modal").modal("close");
                // Display Sucess Message
                 M.toast({
                    html: "Your rating has been removed.",
                    classes: "rounded"
                });
            }
            else if (resp.status === 401) {
                // Display Error Message
                 M.toast({
                    html: "You do not have permission to do that.",
                    classes: "rounded"
                });
            }
            else if (resp.status === 403) {
                // Display Error Message
                M.toast({
                    html: "You do not appear to be logged in.",
                    classes: "rounded"
                });
            }
            else {
                // Display Error Message
                M.toast({
                    html: "An unknown error occurred.",
                    classes: "rounded"
                });
            }
        });    
    }
    else {
        // Display Error Message
        M.toast({
            html: "Please enter a rating for each category.",
            classes: "rounded"
        });
    }
});

// Toggle Bookmark
$(document).delegate("#bookmark", "click", function() {
    // Get Profile ID
    var id = $(this).data("id");

    // Make Request to Server
    $.post("/user/interact/bookmarks", {
        id: id
    }, function(resp) {
        if (resp.status === 200) {
            // Display Success Message
            M.toast({
                html: resp.message,
                classes: "rounded"
            });
        }
        else if (resp.status === 401) {
            // Display Error Message
             M.toast({
                html: "You do not have permission to do that.",
                classes: "rounded"
            });
        }
        else if (resp.status === 403) {
            // Display Error Message
            M.toast({
                html: "You do not appear to be logged in.",
                classes: "rounded"
            });
        }
        else {
            // Display Error Message
            M.toast({
                html: "An unknown error occurred.",
                classes: "rounded"
            });
        }
    });
});

// Personal Note - Clear
$(document).delegate("#note-clear", "click", function() {
    // Clear Note Field
    $("#note").val("");
});

// Personal Note
$(document).delegate("#note-submit", "click", function() {
    // Get Profile & Note
    var id = $(this).data("id"),
        note = $("#note").val();

    // Make Request to Server
    $.post("/user/interact/notes", {
        id: id,
        note: note
    }, function(resp) {
        if (resp.status === 200) {
            // Close Modal
            $(".modal").modal("close");
            // Display Success Message
             M.toast({
                html: "Your note has been saved.",
                classes: "rounded"
            });
        }
        else if (resp.status === 401) {
            // Display Error Message
             M.toast({
                html: "You do not have permission to do that.",
                classes: "rounded"
            });
        }
        else if (resp.status === 403) {
            // Display Error Message
            M.toast({
                html: "You do not appear to be logged in.",
                classes: "rounded"
            });
        }
        else {
            // Display Error Message
            M.toast({
                html: "An unknown error occurred.",
                classes: "rounded"
            });
        }
    });    
});


