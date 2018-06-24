// Get HTML for Link Accounts Page
function accountLink(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/account/link/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Preferences Page
function accountPreferences(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/account/preferences/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Bookmarks Page
function profilesBookmarks(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/profiles/bookmarks/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Make Request to Server
            $.post("/dashboard/get/profiles", {
                type: "bookmarks"
            }, function(resp) {
                // Render HTML
                $("#bookmarks").html(resp);
            });
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Make Request to Server
                $.post("/dashboard/get/profiles", {
                    type: "bookmarks",
                    after: 0
                }, function(resp) {
                    // Render HTML
                    $("#bookmarks").html(resp);
                    // Show New HTML
                    $("#content-wrapper").show("slide", { direction: "left" }, 250);
                });
            }); 
        }
    });
}

// Get HTML for Ratings Page
function profilesRatings(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/profiles/ratings/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Make Request to Server
            $.post("/dashboard/get/profiles", {
                type: "ratings",
                after: 0
            }, function(resp) {
                // Render HTML
                $("#ratings").html(resp);
            });
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Make Request to Server
                $.post("/dashboard/get/profiles", {
                    type: "ratings"
                }, function(resp) {
                    // Render HTML
                    $("#ratings").html(resp);
                    // Show New HTML
                    $("#content-wrapper").show("slide", { direction: "left" }, 250);
                });
            }); 
        }
    });
}

// Get HTML for Nominations Page
function twoosNominations(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/twoos/nominations/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Nominated Submissions Page
function twoosSubmissions(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/twoos/submissions/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Transactions Page
function twoosTransactions(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/twoos/transactions/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for View Advertisement Requests Page
function requestsView(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/requests/view/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Submit Advertisement Request Page
function requestsSubmit(id, init) {
    // Make Request to Server
    $.post("/dashboard/content/requests/submit/", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

$(document).ready(function() {
    // Get User ID, Page & Category
    var id = $("#content-wrapper").data("twitch-id"),
        category = $("#content-wrapper").data("category"),
        page = $("#content-wrapper").data("page");

    // Select HTML to Render
    if (category == "account" && page == "link") {
        // Render Link Accounts Page
        accountLink(id, true);
    }
    else if (category == "account" && page == "preferences") {
        // Render Preferences Page
        accountPreferences(id, true);
    }
    else if (category == "profiles" && page == "bookmarks") {
        // Render Bookmarks Page
        profilesBookmarks(id, true);
    }
    else if (category == "profiles" && page == "ratings") {
        // Render Ratings Page
        profilesRatings(id, true);
    }
    else if (category == "twoos" && page == "nominations") {
        // Render Nominations Page
        twoosNominations(id, true);
    }
    else if (category == "twoos" && page == "submissions") {
        // Render Nominated Submissions Page
        twoosSubmissions(id, true);
    }
    else if (category == "twoos" && page == "transactions") {
        // Render Transactions Page
        twoosTransactions(id, true);
    }
    else if (category == "requests" && page == "view") {
        // Render View Advertisement Requests Page
        requestsView(id, true);
    }
    else if (category == "requests" && page == "submit") {
        // Render Submit Advertisement Requests Page
        requestsSubmit(id, true);
    }
    else {
        // Send User to Preferences Page
        history.pushState("", "", "/dashboard/account/preferences");
        accountPreferences(id, true);
    }
});

$(document).delegate("#dashboard-view-account-preferences", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/account/preferences");
    // Render Preferences Page
    accountPreferences(id, false);
});

$(document).delegate("#dashboard-view-account-link", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/account/link");
    // Render Link Accounts Page
    accountLink(id, false);
});

$(document).delegate("#dashboard-view-profiles-bookmarks", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/profiles/bookmarks");
    // Render Bookmarks Page
    profilesBookmarks(id, false);
});

$(document).delegate("#dashboard-view-profiles-ratings", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/profiles/ratings");
    // Render Ratings Page
    profilesRatings(id, false);
});

$(document).delegate("#dashboard-view-twoos-nominations", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/twoos/nominations");
    // Render Nominations Page
    twoosNominations(id, false);
});

$(document).delegate("#dashboard-view-twoos-submissions", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/twoos/submissions");
    // Render Nominated Submissions Page
    twoosSubmissions(id, false);
});

$(document).delegate("#dashboard-view-twoos-transactions", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/twoos/transactions");
    // Render Transactions Page
    twoosTransactions(id, false);
});

$(document).delegate("#dashboard-view-requests-view", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/requests/view");
    // Render View Advertisement Requests Page
    requestsView(id, false);
});

$(document).delegate("#dashboard-view-requests-submit", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/dashboard/requests/submit");
    // Render Submit Advertisement Requests Page
    requestsSubmit(id, false);
});