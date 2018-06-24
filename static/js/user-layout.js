// Get HTML for View Overview Page
function viewOverview(id, init) {
    // Make Request to Server
    $.post("/user/content/overview", {
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

// Get HTML for View Profile Body Page
function viewBody(id, init) {
    // Make Request to Server
    $.post("/user/content/body", {
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

// Get HTML for View Trophies Page
function viewTrophies(id, init) {
    // Make Request to Server
    $.post("/user/content/trophies", {
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

// Get HTML for View Social Media Page
function viewSocialMedia(id, init) {
    // Make Request to Server
    $.post("/user/content/socialmedia", {
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

// Get HTML for View Communities Page
function viewCommunities(id, init) {
    // Make Request to Server
    $.post("/user/content/communities", {
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

// Get HTML for View Scheduled Streams Page
function viewStreams(id, init) {
    // Make Request to Server
    $.post("/user/content/streams", {
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

// Get HTML for View Videos Page
function viewVideos(id, init) {
    // Make Request to Server
    $.post("/user/content/videos", {
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

// Get HTML for View Featured Profiles Page
function viewProfiles(id, init) {
    // Make Request to Server
    $.post("/user/content/profiles", {
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

// Get HTML for View Purple+ Teams Page
function viewTeams(id, init) {
    // Make Request to Server
    $.post("/user/content/teams", {
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
function viewRequests(id, init) {
    // Make Request to Server
    $.post("/user/content/requests", {
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

// Get HTML for View Contact Form Page
function viewForm(id, init) {
    // Make Request to Server
    $.post("/user/content/form", {
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

// Get HTML for Edit Profile Features Page
function editFeatures(id, init) {
    // Make Request to Server
    $.post("/user/edit/features", {
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

// Get HTML for Edit Profile Overview Page
function editOverview(id, init) {
    // Make Request to Server
    $.post("/user/edit/overview", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Auto-Resize Text Area Fields
            M.textareaAutoResize($("textarea"));
            // Check for Tags
            if ($("#profile-overview-tags").data("tags")) {
                // Get Tags
                var tags = $("#profile-overview-tags").data("tags").split(","),
                    data = [];

                // Reformat Tags
                for (tag of tags) {
                    data.push({ tag: tag })
                }
                // Add Tags to Input
                $("#profile-overview-tags").chips({
                    data: data
                });
            }
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Auto-Resize Text Area Fields
                M.textareaAutoResize($("textarea"));
                // Check for Tags
                if ($("#profile-overview-tags").data("tags")) {
                    // Get Tags
                    var tags = $("#profile-overview-tags").data("tags").split(","),
                        data = [];

                    // Reformat Tags
                    for (tag of tags) {
                        data.push({ tag: tag })
                    }
                    // Add Tags to Input
                    $("#profile-overview-tags").chips({
                        data: data
                    });
                }
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Edit Profile Body Page
function editBody(id, init) {
    // Make Request to Server
    $.post("/user/edit/body", {
        id: id
    }, function(resp) {
        // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Auto-Resize Text Area Fields
            M.textareaAutoResize($("textarea"));
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Auto-Resize Text Area Fields
                M.textareaAutoResize($("textarea"));
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Edit Social Media Page
function editSocialMedia(id, init) {
    // Make Request to Server
    $.post("/user/edit/socialmedia", {
        id: id
    }, function(resp) {
    // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Resize Text Fields
            M.updateTextFields();
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Resize Text Fields
                M.updateTextFields();
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Edit Communities Page
function editCommunities(id, init) {
    // Make Request to Server
    $.post("/user/edit/communities", {
        id: id
    }, function(resp) {
    // Check if Request is Made on Page Initialisation
        if (init) {
            // Render HTML
            $("#content-wrapper").html(resp);
            // Resize Text Fields
            M.updateTextFields();
        }
        else {
            // Hide Previous HTML
            $("#content-wrapper").hide("slide", { direction: "right" }, 250, function() {
                // Render HTML
                $("#content-wrapper").html(resp);
                // Resize Text Fields
                M.updateTextFields();
                // Show New HTML
                $("#content-wrapper").show("slide", { direction: "left" }, 250);
            }); 
        }
    });
}

// Get HTML for Edit Scheduled Streams Page
function editStreams(id, init) {
    // Make Request to Server
    $.post("/user/edit/streams", {
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

// Get HTML for Edit Featured Profiles Page
function editProfiles(id, init) {
    // Make Request to Server
    $.post("/user/edit/profiles", {
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

// Get HTML for Edit Purple+ Teams Page
function editTeams(id, init) {
    // Make Request to Server
    $.post("/user/edit/teams", {
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
    // Get Category & Page
    var id = $("#content-wrapper").data("twitch-id"),
        page = $("#content-wrapper").data("page");

    // Select HTML to Render
    if (page == "overview") {
        // Render View Overview Page
        viewOverview(id, true);
    }
    else if (page == "body") {
        // Render View Profile Body Page
        viewBody(id, true);
    }
    else if (page == "trophies") {
        // Render View Trophies Page
        viewTrophies(id, true);
    }
    else if (page == "social") {
        // Render View Social Media Page
        viewSocialMedia(id, true);
    }
    else if (page == "communities") {
        // Render View Communities Page
        viewCommunities(id, true);
    }
    else if (page == "streams") {
        // Render View Scheduled Streams Page
        viewStreams(id, true);
    }
    else if (page == "videos") {
        // Render View Videos Page
        viewVideos(id, true);
    }
    else if (page == "profiles") {
        // Render View Featured Profiles Page
        viewProfiles(id, true);
    }
    else if (page == "teams") {
        // Render View Purple+ Teams Page
        viewTeams(id, true);
    }
    else if (page == "requests") {
        // Render View Advertisement Requests Page
        viewRequests(id, true);
    }
    else if (page == "form") {
        // Render View Contact Form Page
        viewForm(id, true);
    }
    else if (page == "edit-features") {
        // Render Edit Profile Features Page
        editFeatures(id, true);
    }
    else if (page == "edit-overview") {
        // Render Edit Overview Page
        editOverview(id, true);
    }
    else if (page == "edit-body") {
        // Render Edit Profile Body Page
        editBody(id, true);
    }
    else if (page == "edit-social") {
        // Render Edit Social Media Page
        editSocialMedia(id, true);
    }
    else if (page == "edit-communities") {
        // Render Edit Communities Page
        editCommunities(id, true);
    }
    else if (page == "edit-streams") {
        // Render Edit Scheduled Streams Page
        editStreams(id, true);
    }
    else if (page == "edit-profiles") {
        // Render Edit Featured Profiles Page
        editProfiles(id, true);
    }
    else if (page == "edit-teams") {
        // Render Edit Purple+ Teams Page
        editTeams(id, true);
    }
    else {
        // Send User to Overview Page
        history.pushState("", "", "/user/" + user + "/overview");
        viewOverview(id, true);
    }
});

$(document).delegate("#user-view-overview", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/overview");
    // Render View Overview Page
    viewOverview(id, false);
});

$(document).delegate("#user-view-body", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/body");
    // Render View Profile Body Page
    viewBody(id, false);
});

$(document).delegate("#user-view-trophies", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/trophies");
    // Render View Trophies Page
    viewTrophies(id, false);
});

$(document).delegate("#user-view-socialmedia", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/social");
    // Render View Social Media Page
    viewSocialMedia(id, false);
});

$(document).delegate("#user-view-communities", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/communities");
    // Render View Communities Page
    viewCommunities(id, false);
});

$(document).delegate("#user-view-streams", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/streams");
    // Render View Scheduled Streams Page
    viewStreams(id, false);
});

$(document).delegate("#user-view-videos", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/videos");
    // Render View Videos Page
    viewVideos(id, false);
});

$(document).delegate("#user-view-profiles", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/profiles");
    // Render View Featured Profiles Page
    viewProfiles(id, false);
});

$(document).delegate("#user-view-teams", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/teams");
    // Render View Purple+ Teams Page
    viewTeams(id, false);
});

$(document).delegate("#user-view-requests", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/requests");
    // Render View Advertisement Requests Page
    viewRequests(id, false);
});

$(document).delegate("#user-view-form", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/form");
    // Render View Contact Form Page
    viewForm(id, false);
});

$(document).delegate("#user-edit-features", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/features/edit");
    // Render Edit Profile Features Page
    editFeatures(id, false);
});

$(document).delegate("#user-edit-overview", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/overview/edit");
    // Render Edit Overview Page
    editOverview(id, false);
});

$(document).delegate("#user-edit-body", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/body/edit");
    // Render Edit Profile Body Page
    editBody(id, false);
});

$(document).delegate("#user-edit-socialmedia", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/social/edit");
    // Render Edit Social Media Page
    editSocialMedia(id, false);
});

$(document).delegate("#user-edit-communities", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/communities/edit");
    // Render Edit Communities Page
    editCommunities(id, false);
});

$(document).delegate("#user-edit-streams", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/streams/edit");
    // Render Edit Scheduled Streams Page
    editStreams(id, false);
});

$(document).delegate("#user-edit-profiles", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/profiles/edit");
    // Render Edit Featured Profiles Page
    editProfiles(id, false);
});

$(document).delegate("#user-edit-teams", "click", function() {
    // Get User ID & Display Name
    var id = $("#content-wrapper").data("twitch-id"),
        user = $("#content-wrapper").data("twitch-username");

    // Update URL
    history.pushState("", "", "/user/" + user + "/teams/edit");
    // Render Edit Purple+ Teams Page
    editTeams(id, false);
});