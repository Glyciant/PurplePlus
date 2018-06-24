// Pending Profiles - Approve
$(document).delegate("#approve", "click", function() {
    // Get Profile ID & Display Name
    var id = $(this).data("id"),
        name = $(this).data("name");

    // Make Request to Server
    $.post("/admin/submit/profiles/pending/approve", {
        id: id,
        name: name
    }, function(resp) {
        if (resp.status === 200) {
            // Dismiss Profile
            $("#profile-" + id).hide("slow");
        }
        // Display Response Message
        M.toast({
            html: resp.message,
            classes: "rounded"
        });
    });
});

// Pending Profiles - Hide
$(document).delegate("#hide", "click", function() {
    // Get Profile ID
    var id = $(this).data("id");

    // Dismiss Profile
    $("#profile-" + id).hide("slow");
});

// Pending Profiles - Reject Modal Trigger
$(document).delegate("#reject-trigger", "click", function() {
    // Get Profile ID & Display Name
    var id = $(this).data("id"),
        name = $(this).data("name");

    // Set Data Attributes for Reject Button
    $("#reject").data("id", id);
    $("#reject").data("name", name);
    // Set Modal Header
    $("#modal-reject-name").html(name);
    // Open Modal
    $("#modal-reject").modal("open");
});

// Pending Profiles - Reject
$(document).delegate("#reject", "click", function() {
    // Get Profile ID, Display Name, Rejection Reason & Rejection Comment
    var id = $(this).data("id"),
        name = $(this).data("name"),
        reason = $("#rejection-reason select").val(),
        comment = $("#rejection-comment").val();

    // Check That Reason is Provided
    if (reason) {
        // Make Request to Server
        $.post("/admin/submit/profiles/pending/reject", {
            id: id,
            name: name,
            reason: reason,
            comment: comment
        }, function(resp) {
            if (resp.status === 200) {
                // Close Modal
                $("#modal-reject").modal("close");
                // Dismiss Profile
                $("#profile-" + id).hide("slow");
            }
            // Display Response Message
            M.toast({
                html: resp.message,
                classes: "rounded"
            });
        });
    }
    else {
        // Display Error
        M.toast({
            html: "Please add a rejection reason.",
            classes: "rounded"
        });
    }
});

// Pending Profiles - Auto Update
setInterval(function() {
    // Check if Page is Correct
    if ($("#profiles-pending").html()) {
        // Check if Profiles are Already in Table
        if ($("#profiles-pending tbody tr").length === 0) {
            // Make Request to Server
            $.post("/admin/content/profiles/pending", function(resp) {
                // Hide Previous HTML
                $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                    // Render HTML
                    $("#content-wrapper").html(resp);
                    // Re-Initialise Select Elements
                    $('select').formSelect();
                    // Re-Initialise Tooltips
                    $('.tooltipped').tooltip();
                    // Re-Initialise Modals
                    $('.modal').modal();
                    // Show New HTML
                    $("#content-wrapper").show("slide", { direction: "left" }, 250);
                }); 
            });
        }
    }
}, 30000);

// Profiles Manager - Search Button
$(document).delegate("#profiles-search", "click", function() {
    // Get Search Query
    var name = $("#twitch-name").val();

    // Check That Query is Provided
    if (name) {
        // Make Request to Server
        $.post("/admin/get/profiles/manager/", {
            name: name
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
            html: "Please enter a Twitch Username.",
            classes: "rounded"
        });
    }
});

// Profiles Manager - Back Button
$(document).delegate("#profiles-back", "click", function() {
    // Make Request to Server
    $.post("/admin/content/profiles/manager", function(resp) {
        // Hide Previous HTML
        $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Show New HTML
            $("#content-wrapper").show("slide", { direction: "left" }, 250);
        }); 
    });
});

// Profiles Manager - Submit Button
$(document).delegate("#profiles-submit", "click", function() {
    // Get Profile ID & Approval Status
    var id = $(this).data("id"),
        approval = {
            status: $("#search-data-status select").val(),
            reason: $("#search-data-reason select").val(),
            comment: $("#search-data-comment").val()
        }

    // Check All Fields are Completed
    if (id && approval && approval.status && (approval.status != "rejected" || approval.reason)) {
        // Make Request to Server
        $.post("/admin/submit/profiles/manager/", {
            id: id,
            approval: approval
        }, function(resp) {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Check for Success Response
                if (resp.indexOf("Twitch Username") !== -1) {
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

// Profiles Manager - Rejection Reason & Comments Fields
$(document).delegate("#search-data-status select", "change", function() {
    // Get New Select Value
    if ($(this).val() == "rejected") {
        // Enable Rejection Reason Select Element
        $("#search-data-reason select").prop("disabled", false);
        // Enable Rejection Comment Text Field
        $("#search-data-comment").prop("disabled", false);
        // Re-Initialise Select Elements
        $('select').formSelect();
        // Re-Initialise Text Fields
        M.updateTextFields();
    }
    else {
        // Disable Rejection Reason Select Element
        $("#search-data-reason select").prop("disabled", true);
        // Disable Rejection Comment Text Field
        $("#search-data-comment").prop("disabled", true);
        // Clear Rejection Reason Select Element
        $("#search-data-reason select").val("");
        // Clear Rejection Comment Text Field
        $("#search-data-comment").val("");
        // Re-Initialise Select Elements
        $('select').formSelect();
        // Re-Initialise Text Fields
        M.updateTextFields();
    }
});