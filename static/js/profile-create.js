$(document).ready(function() {
    var tags = $("#profile-overview-tags").data("tags").split(",");

    for (tag of tags) {
        M.Chips.getInstance($("#profile-overview-tags")[0]).addChip({
            tag: tag
        });
    }
});

$(document).delegate("#create-profile", "click", function() {
    $.post("/profile/create", {}, function(resp) {
        if (resp.status === 200) {
            window.location = "/profile/overview";
        }
        else if (resp.status === 400) {
            window.location = "/auth/redirect/twitch";
        }
        else {
            M.toast({
                html: "An unknown error occurred.",
                classes: "rounded"
            });
        }
    });
});

$(document).delegate("#next-step", "click", function() {
    var page = $(this).data("page");
    if (page == "overview") {
        var introduction = $("#profile-overview-introduction").val(),
            clip = $("#profile-overview-clip").val(),
            tags = M.Chips.getInstance($("#profile-overview-tags")[0]).chipsData.map(function(x) { return x.tag; }),
            valid = true;

        $.post("/profile/next", {
            page: page,
            introduction: introduction,
            clip: clip,
            tags: tags
        }, function(resp) {
            if (resp.status === 200) {
                window.location = "/profile/body";
            }
            else if (resp.status === 400) {
                M.toast({
                    html: "A field has been completed incorrectly.",
                    classes: "rounded"
                });
                if (resp.errors.indexOf("introduction") !== -1) {
                    $("#profile-overview-introduction").addClass("invalid");
                }
                if (resp.errors.indexOf("clip") !== -1) {
                    $("#profile-overview-clip").addClass("invalid");
                }
                if (resp.errors.indexOf("tags") !== -1) {
                    $("#profile-overview-tags input").addClass("invalid");
                }
                setTimeout(function() {
                    $("#profile-overview-introduction").removeClass("invalid");
                    $("#profile-overview-clip").removeClass("invalid");
                    $("#profile-overview-tags input").removeClass("invalid");
                }, 3000);
            }
            else { 
                M.toast({
                    html: "An unknown error occurred.",
                    classes: "rounded"
                });
            }
        });
    }
    
});