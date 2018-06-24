$(document).delegate("#profile-save-features", "click", function() {
    // Get Data about Profile Features
    var trophies = $("#profile-features-trophies").is(":checked"),
        player = $("#profile-features-player").is(":checked"),
        videos = $("#profile-features-videos").is(":checked"),
        requests = $("#profile-features-requests").is(":checked"),
        reddit = $("#profile-features-reddit").is(":checked"),
        discord = $("#profile-features-discord").is(":checked"),
        socialmedia = $("#profile-features-socialmedia").is(":checked"),
        communities = $("#profile-features-communities").is(":checked"),
        teams = $("#profile-features-teams").is(":checked"),
        profiles = $("#profile-features-profiles").is(":checked"),
        discussions = $("#profile-features-discussions").is(":checked"),
        contact = $("#profile-features-contact").is(":checked"),
        notifications = {
            twitch: $("#profile-notifications-twitch").is(":checked"),
            reddit: $("#profile-notifications-reddit").is(":checked"),
            discord: $("#profile-notifications-discord").is(":checked")
        };

    // Make Request to Server
    $.post("/profile/save", {
        page: "features",
        trophies: trophies,
        player: player,
        videos: videos,
        requests: requests,
        reddit: reddit,
        discord: discord,
        social_media: socialmedia,
        communities: communities,
        teams: teams,
        profiles: profiles,
        discussions: discussions,
        contact: contact,
        notifications: notifications
    }, function(resp) {
        if (resp.status === 200) {
            // Redirect User Back to Profile Overview
            window.location = "../overview";
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

$(document).delegate("#profile-save-overview", "click", function() {
    // Get Data about Overview
    var introduction = $("#profile-overview-introduction").val(),
        clip = $("#profile-overview-clip").val(),
        tags = M.Chips.getInstance($("#profile-overview-tags")[0]).chipsData.map(function(x) { return x.tag; });

    // Make Request to Server
    $.post("/profile/save", {
        page: "overview",
        introduction: introduction,
        clip: clip,
        tags: tags
    }, function(resp) {
        if (resp.status === 200) {
            // Redirect User Back to Profile Overview
            window.location = "../overview";
        }
        else if (resp.status === 400) {
            // Display Error Message
            M.toast({
                html: "A field has been completed incorrectly.",
                classes: "rounded"
            });
            // Highlight Invalid Fields
            if (resp.errors.indexOf("introduction")  > -1) {
                $("#profile-overview-introduction").addClass("invalid");
            }
            if (resp.errors.indexOf("clip") > -1) {
                $("#profile-overview-clip").addClass("invalid");
            }
            if (resp.errors.indexOf("tags") > -1) {
                $("#profile-overview-tags input").addClass("invalid");
            }
            // Clear Highlight After 3s
            setTimeout(function() {
                $("#profile-overview-introduction").removeClass("invalid");
                $("#profile-overview-clip").removeClass("invalid");
                $("#profile-overview-tags input").removeClass("invalid");
            }, 3000);
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

$(document).delegate("#profile-save-body", "click", function() {
    // Get Data about Profile Body
    var categories = {},
        about = $("#profile-body-about").val(),
        goals = $("#profile-body-goals").val(),
        experiences = $("#profile-body-experiences").val(),
        background = $("#profile-body-background").val(),
        other = $("#profile-body-other").val();

    // Get Checkbox Values
    categories.gaming = $("#profile-body-categories-gaming").is(":checked");
    categories.creative = $("#profile-body-categories-creative").is(":checked");
    categories.socialeating = $("#profile-body-categories-socialeating").is(":checked");
    categories.irl = $("#profile-body-categories-irl").is(":checked");
    categories.talkshow = $("#profile-body-categories-talkshow").is(":checked");
    categories.music = $("#profile-body-categories-music").is(":checked");
    categories.artist = $("#profile-body-categories-artist").is(":checked");
    categories.communitymanager = $("#profile-body-categories-communitymanager").is(":checked");
    categories.developer = $("#profile-body-categories-developer").is(":checked");
    categories.editor = $("#profile-body-categories-editor").is(":checked");
    categories.moderator = $("#profile-body-categories-moderator").is(":checked");
    categories.viewer = $("#profile-body-categories-viewer").is(":checked");

    // Make Request to Server
    $.post("/profile/save", {
        page: "body",
        categories: categories,
        about: about,
        goals: goals,
        experiences: experiences,
        background: background,
        other: other
    }, function(resp) {
        if (resp.status === 200) {
            // Redirect User Back to Profile Body
            window.location = "../body";
        }
        else if (resp.status === 400) {
            // Display Error Message
            M.toast({
                html: "A field has been completed incorrectly.",
                classes: "rounded"
            });
            // Highlight Invalid Fields
            if (resp.errors.indexOf("categories") > -1) {
                $("#profile-body-categories").addClass("red");
                $("#profile-body-categories").addClass("lighten-4");
            }
            if (resp.errors.indexOf("about") > -1) {
                $("#profile-body-about").addClass("invalid");
            }
            if (resp.errors.indexOf("goals") > -1) {
                $("#profile-body-goals").addClass("invalid");
            }
            if (resp.errors.indexOf("experiences") > -1) {
                $("#profile-body-experiences").addClass("invalid");
            }
            if (resp.errors.indexOf("background") > -1) {
                $("#profile-body-background").addClass("invalid");
            }
            // Clear Highlight After 3s
            setTimeout(function() {
                $("#profile-body-categories").removeClass("red");
                $("#profile-body-categories").removeClass("lighten-4");
                $("#profile-body-about").removeClass("invalid");
                $("#profile-body-goals").removeClass("invalid");
                $("#profile-body-experiences").removeClass("invalid");
                $("#profile-body-background").removeClass("invalid");
            }, 3000);
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

$(document).delegate("#profile-save-socialmedia", "click", function() {
    // Get Data about Social Media
    var facebook = $("#profile-socialmedia-facebook").val(),
        facebook_url = $("#profile-socialmedia-facebook-url").val(),
        twitter = $("#profile-socialmedia-twitter").val(),
        instagram = $("#profile-socialmedia-instagram").val(),
        youtube = $("#profile-socialmedia-youtube").val(),
        youtube_url = $("#profile-socialmedia-youtube-url").val(),
        snapchat = $("#profile-socialmedia-snapchat").val(),
        steam = $("#profile-socialmedia-steam").val(),
        github = $("#profile-socialmedia-github").val(),
        deviantart = $("#profile-socialmedia-deviantart").val(),
        soundcloud = $("#profile-socialmedia-soundcloud").val(),
        googleplus = $("#profile-socialmedia-googleplus").val(),
        linkedin = $("#profile-socialmedia-linkedin").val(),
        tumblr = $("#profile-socialmedia-tumblr").val(),
        patreon = $("#profile-socialmedia-patreon").val(),
        askfm = $("#profile-socialmedia-askfm").val();

    // Make Request to Server
    $.post("/profile/save", {
        page: "socialmedia",
        facebook: facebook,
        facebook_url: facebook_url,
        twitter: twitter,
        instagram: instagram,
        youtube: youtube,
        youtube_url: youtube_url,
        snapchat: snapchat,
        steam: steam,
        github: github,
        deviantart: deviantart,
        soundcloud: soundcloud,
        googleplus: googleplus,
        linkedin: linkedin,
        tumblr: tumblr,
        patreon: patreon,
        askfm: askfm
    }, function(resp) {
        if (resp.status === 200) {
            // Redirect User Back to Social Media
            window.location = "../social";
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

$(document).delegate("#profile-save-communities", "click", function() {
    // Get Data about Communities
    var twitch_desktop = $("#profile-communities-twitch-desktop").val(),
        twitch_community = $("#profile-communities-twitch-community").val(),
        subreddit = $("#profile-communities-subreddit").val(),
        discord = $("#profile-communities-discord").val(),
        slack = $("#profile-communities-slack").val(),
        steam = $("#profile-communities-steam").val();

    // Make Request to Server
    $.post("/profile/save", {
        page: page,
        twitch_desktop: twitch_desktop,
        twitch_community: twitch_community,
        subreddit: subreddit,
        discord: discord,
        slack: slack,
        steam: steam
    }, function(resp) {
        if (resp.status === 200) {
            // Redirect User Back to Communities
            window.location = "../communities";
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