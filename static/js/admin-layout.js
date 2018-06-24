// Get HTML for Account Manager
function usersManager(init) {
    // Make Request to Server
    $.post("/admin/content/users/manager", function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Re-Initialise Select Elements
            $('select').formSelect();
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Re-Initialise Select Elements
                $('select').formSelect();
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Account Query Builder
function usersQuery(init) {
    // Make Request to Server
    $.post("/admin/content/users/query", function(resp) {
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

// Get HTML for Pending Profiles
function profilesPending(init) {
    // Make Request to Server
    $.post("/admin/content/profiles/pending", function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Re-Initialise Select Elements
            $('select').formSelect();
            // Re-Initialise Tooltips
            $('.tooltipped').tooltip();
            // Re-Initialise Modals
            $('.modal').modal();
        }
        else {
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
        }
    });
}

// Get HTML for Profile Manager
function profilesManager(init) {
    // Make Request to Server
    $.post("/admin/content/profiles/manager", function(resp) {
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

// Get HTML for Pending Twoos Nominations
function twoosNominations(init) {
    // Make Request to Server
    $.post("/admin/content/twoos/nominations", function(resp) {
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

// Get HTML for Twoos Nominations Query Builder
function twoosQuery(init) {
    // Make Request to Server
    $.post("/admin/content/twoos/query", function(resp) {
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

// Get HTML for Twoos Nominations Transactions Query Builder
function twoosTransactions(init) {
    // Make Request to Server
    $.post("/admin/content/twoos/transactions", function(resp) {
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

// Get HTML for Pending Advertisement Requests
function requestsPending(init) {
    // Make Request to Server
    $.post("/admin/content/requests/pending", function(resp) {
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

// Get HTML for Advertisement Requests Query Builder
function requestsQuery(init) {
    // Make Request to Server
    $.post("/admin/content/requests/query", function(resp) {
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

// Get HTML for Discord Commands Management
function discordCommands(init) {
    // Make Request to Server
    $.post("/admin/content/discord/commands", function(resp) {
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

// Get HTML for Discord Blacklist Management
function discordBlacklist(init) {
    // Make Request to Server
    $.post("/admin/content/discord/blacklist", function(resp) {
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

// Get HTML for Short Links Management
function administrationLinks(init) {
    // Make Request to Server
    $.post("/admin/content/administration/links", function(resp) {
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

// Get HTML for Moderation Log
function administrationLog(init) {
    // Make Request to Server
    $.post("/admin/content/administration/log", function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            $.post("/admin/get/administration/log", {
                after: 0
            }, function(resp) {
                // Render HTML
                $("#logs").html(resp);
            });
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Make Request to Server
                $.post("/admin/get/administration/log", {
                    after: 0
                }, function(resp) {
                    // Render HTML
                    $("#logs").html(resp);
                    // Show New HTML
                    $("#content-wrapper").show("slide", { direction: "left" }, 250);
                });
            }); 
        }
    });
}

// Get HTML for Site Settings
function administrationSettings(init) {
    // Make Request to Server
    $.post("/admin/content/administration/settings", function(resp) {
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
    // Get Category & Page
    var category = $("#content-wrapper").data("category"),
        page = $("#content-wrapper").data("page");

    // Select HTML to Render
    if (category == "users" && page == "manager") {
        // Render Account Manager
        usersManager(true);
    }
    else if (category == "users" && page == "query") {
        // Render Account Query Builder
        usersQuery(true);
    }
    else if (category == "profiles" && page == "pending") {
        // Render Pending Profiles
        profilesPending(true);
    }
    else if (category == "profiles" && page == "manager") {
        // Render Profile Manager
        profilesManager(true);
    }
    else if (category == "twoos" && page == "nominations") {
        // Render Pending Twoos Nominations
        twoosNominations(true);
    }
    else if (category == "twoos" && page == "query") {
        // Render Twoos Nominations Query Builder
        twoosQuery(true);
    }
    else if (category == "twoos" && page == "transactions") {
        // Render Twoos Transactions Query Builder
        twoosTransactions(true);
    }
    else if (category == "requests" && page == "pending") {
        // Render Pending Advertisement Requests
        requestsPending(true);
    }
    else if (category == "requests" && page == "query") {
        // Render Advertisement Requests Query Builder
        requestsQuery(true);
    }
    else if (category == "discord" && page == "commands") {
        // Render Discord Commands Management
        discordCommands(true);
    }
    else if (category == "discord" && page == "blacklist") {
        // Render Discord Blacklist Management
        discordBlacklist(true);
    }
    else if (category == "administration" && page == "links") {
        // Render Short Links Management
        administrationLinks(true);
    }
    else if (category == "administration" && page == "log") {
        // Render Moderation Log
        administrationLog(true);
    }
    else if (category == "administration" && page == "settings") {
        // Render Site Settings
        administrationSettings(true);
    }
    else {
        // Send User to Pending Profiles
        history.pushState("", "", "/admin/profiles/pending");
        profilesPending(true);
    }
});

$(document).delegate("#admin-users-manager", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/users/manager");
    // Render Account Manager
    usersManager(false);
});

$(document).delegate("#admin-users-query", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/users/query");
    // Render Account Query Builder
    usersQuery(false);
});

$(document).delegate("#admin-profiles-pending", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/profiles/pending");
    // Render Pending Profiles
    profilesPending(false);
});

$(document).delegate("#admin-profiles-manager", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/profiles/manager");
    // Render Profile Manager
    profilesManager(false);
});

$(document).delegate("#admin-twoos-nominations", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/twoos/nominations");
    // Render Pending Twoos Nominations
    twoosNominations(false);
});

$(document).delegate("#admin-twoos-query", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/twoos/query");
    // Render Twoos Nominations Query Builder
    twoosQuery(false);
});

$(document).delegate("#admin-twoos-transactions", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/twoos/transactions");
    // Render Twoos Transactions Query Builder
    twoosTransactions(false);
});

$(document).delegate("#admin-requests-pending", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/requests/pending");
    // Render Pending Advertisement Requests
    requestsPending(false);
});

$(document).delegate("#admin-requests-query", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/requests/query");
    // Render Advertisement Requests Query Builder
    requestsQuery(false);
});

$(document).delegate("#admin-discord-commands", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/discord/commands");
    // Render Discord Commands Management
    discordCommands(false);
});

$(document).delegate("#admin-discord-blacklist", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/discord/blacklist");
    // Render Discord Blacklist Management
    discordBlacklist(false);
});

$(document).delegate("#admin-administration-links", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/administration/links");
    // Render Short Links Management
    administrationLinks(false);
});

$(document).delegate("#admin-administration-log", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/administration/log");
    // Render Moderation Log
    administrationLog(false);
});

$(document).delegate("#admin-administration-settings", "click", function() {
    // Update URL
    history.pushState("", "", "/admin/administration/settings");
    // Render Site Settings
    administrationSettings(false);
});