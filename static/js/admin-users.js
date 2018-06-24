// Users Manager - Search Button
$(document).delegate("#users-search", "click", function() {
    // Get Search Field & Search Query
    var field = $("#search-field select").val(),
        query = $("#search-query").val();

    // Check that Search Field & Search Query are Provided
    if (field && query) {
        // Make Request to Server
        $.post("/admin/get/users/manager/", {
            field: field,
            query: query
        }, function(resp) {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Re-Initialise Select Elements
                $('select').formSelect();
                // Re-Initialise Text Fields
                M.updateTextFields();
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        });
    }
    else {
        // Display Error Message
        M.toast({
            html: "Please enter a search query.",
            classes: "rounded"
        });
    }
});

// Users Manager - Back Button
$(document).delegate("#users-back", "click", function() {
    // Make Request to Server
    $.post("/admin/content/users/manager", function(resp) {
        // Hide Previous HTML
        $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Re-Initialise Select Elements
            $('select').formSelect();
            // Re-Initialise Text Fields
            M.updateTextFields();
            // Show New HTML
            $("#content-wrapper").show("slide", { direction: "left" }, 250);
        }); 
    });
});

// Users Manager - Submit Button
$(document).delegate("#users-submit", "click", function() {
    // Get Data about User
    var id = $(this).data("id"),
        user_types = {
            site: $("#search-data-type-site select").val(),
            subreddit: $("#search-data-type-subreddit select").val(),
            ama: $("#search-data-ama").is(":checked"),
            admin: $("#search-data-admin").is(":checked"),
            beta: $("#search-data-beta").is(":checked")
        },
        balance = $("#search-data-twoos-balance").val(),
        bans = {
            profiles: $("#search-data-bans-profiles").is(":checked"),
            twoos: $("#search-data-bans-twoos").is(":checked"),
            requests: $("#search-data-bans-requests").is(":checked")
        };

    // Check That User ID & Balance are Given
    if (id && balance) {
        $.post("/admin/submit/users/manager/", {
            id: id,
            user_types: user_types,
            balance: balance,
            bans: bans
        }, function(resp) {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Check for Success Response
                if (resp.indexOf("Search Field") !== -1) {
                    // Show Success Message
                    M.toast({
                        html: "Your edits have been saved.",
                        classes: "rounded"
                    });
                }
                // Re-Initialise Select Elements
                $('select').formSelect();
                // Re-Initialise Text Fields
                M.updateTextFields();
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        });
    }
    else {
        // Display Error Message
        M.toast({
            html: "Please enter a value for all fields.",
            classes: "rounded"
        });
    }
});
