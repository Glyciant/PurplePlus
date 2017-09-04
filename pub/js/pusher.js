var arraydata = [],
    track = "new";

$(document).ready(function() {
  var converter = new showdown.Converter();

  function inArray(value, array) {
    return array.indexOf(value) > -1;
  }

  function redditData(type, callback) {
    var subreddit = $("#alert").data("subreddit");
    $.getJSON("https://www.reddit.com/" + subreddit + "/" + type + ".json?limit=1", function(data) {
      var id = data.data.children[0].data.id,
          user = data.data.children[0].data.author,
          user_flair = data.data.children[0].data.author_flair_text,
          flair_css = data.data.children[0].data.author_flair_css_class,
          fromsub = data.data.children[0].data.subreddit;
        if (type == "new") {
          var new_type = "post",
              text = converter.makeHtml(data.data.children[0].data.selftext),
              domain = data.data.children[0].data.domain,
              url = data.data.children[0].data.url,
              permalink = "https://reddit.com" + data.data.children[0].data.permalink,
              title = data.data.children[0].data.title,
              link_flair = data.data.children[0].data.link_flair_text;
        }
        else {
          var new_type = "comment",
              comment = converter.makeHtml(data.data.children[0].data.body),
              permalink = data.data.children[0].data.link_url
              title = data.data.children[0].data.link_title;
        }
        if (title.length > 120) {
          title = title.substring(0, 120) + "...";
        }
        var json = {
          id: id,
          type: new_type,
          user: user,
          user_flair: user_flair,
          flair_css: flair_css,
          link_flair: link_flair,
          subreddit: fromsub,
          domain: domain,
          url: url,
          permalink:  permalink + id,
          comment: comment,
          text: text,
          url: url,
          title: title,
        };
        callback(json);
    });
  }

  $.ajaxSetup({
    cache: false
  });

  setInterval(function() {
    redditData(track, function(res) {
      if (!inArray(res.id, arraydata)) {
        arraydata.push(res.id);
        if (res.type == "post") {
            if (res.domain == "self.Twitch") {
              var html = '<div class="card" id="submission-' + res.id + '" style="display: none;"><div class="card-content"><div class="row" style="margin: 0;"><div class="col s8"><h5 title="' + res.user_flair + '"><a href="https://reddit.com/user/' + res.user + '" id="submission-user" target="_blank">' + res.user + '</a></h5></div><div class="col s4 right-align"><a href="' + res.permalink + '" class="btn-floating waves-effect waves-light grey darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Open" target="_blank" style="margin: 0 5px;"><i class="material-icons">call_made</i></a><a href="#!" id="approve" class="btn-floating waves-effect waves-light green darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Approve" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">done</i></a><a href="#!" id="remove" class="btn-floating waves-effect waves-light red darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Remove" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">close</i></a><a href="#!" id="lock" class="btn-floating waves-effect waves-light orange darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Lock" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">lock</i></a><a href="#!" id="comment" class="btn-floating waves-effect waves-light custom darken-1 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Comment" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">chat_bubble</i></a><a href="#!" id="flair" class="btn-floating waves-effect waves-light custom lighten-1 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Flair" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">flag</i></a></div><div class="col s8"><p><strong>' + res.title + '</strong></p></div><div class="col s4 right-align"><p>' + res.link_flair +'</p></div><div class="col s12" id="submission-body"><hr /><p>' + res.text + '</p></div></div></div></div>';
            }
            else {
              var html = '<div class="card" id="submission-' + res.id + '" style="display: none;"><div class="card-content"><div class="row" style="margin: 0;"><div class="col s8"><h5 title="' + res.user_flair + '"><a href="https://reddit.com/user/' + res.user + '" id="submission-user" target="_blank">' + res.user + '</a></h5></div><div class="col s4 right-align"><a href="' + res.permalink + '" class="btn-floating waves-effect waves-light grey darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Open Post" target="_blank" style="margin: 0 5px;"><i class="material-icons">call_made</i></a><a href="' + res.url + '" class="btn-floating waves-effect waves-light white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Open Link" target="_blank" style="margin: 0 5px;"><i class="material-icons">play_arrow</i></a><a href="#!" id="approve" class="btn-floating waves-effect waves-light green darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Approve" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">done</i></a><a href="#!" id="remove" class="btn-floating waves-effect waves-light red darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Remove" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">close</i></a><a href="#!" id="lock" class="btn-floating waves-effect waves-light orange darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Lock" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">lock</i></a><a href="#!" id="comment" class="btn-floating waves-effect waves-light custom darken-1 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Comment" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">chat_bubble</i></a><a href="#!" id="flair" class="btn-floating waves-effect waves-light custom lighten-1 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Flair" data-id="t3_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">flag</i></a></div><div class="col s8"><p><strong>' + res.title + '</strong></p></div><div class="col s4 right-align"><p>' + res.link_flair +'</p></div><div class="col s12" id="submission-body"><hr /><p>' + res.text + '</p></div></div></div></div>';
            }
        }
        else {
          var html = '<div class="card" id="submission-' + res.id + '" style="display: none;"><div class="card-content"><div class="row" style="margin: 0;"><div class="col s8"><h5 title="' + res.user_flair + '"><a href="https://reddit.com/user/' + res.user + '" id="submission-user" target="_blank">' + res.user + '</a></h5></div><div class="col s4 right-align"><a href="' + res.permalink + '" class="btn-floating waves-effect waves-light grey darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Open" target="_blank" style="margin: 0 5px;"><i class="material-icons">call_made</i></a><a href="#!" id="approve" class="btn-floating waves-effect waves-light green darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Approve" data-id="t1_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">done</i></a><a href="#!" id="remove" class="btn-floating waves-effect waves-light red darken-2 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Remove" data-id="t1_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">close</i></a><a href="#!" id="comment" class="btn-floating waves-effect waves-light custom darken-1 white-text tooltipped" data-position="bottom" data-delay="50" data-tooltip="Comment" data-id="t1_' + res.id + '" style="margin: 0 5px;"><i class="material-icons">chat_bubble</i></a></div><div class="col s12"><p><strong>' + res.title + '</strong></p></div><div class="col s12" id="submission-body"><hr /><p>' + res.comment + '</p></div></div></div></div></div>'
        }
        $("#data").prepend(html);
        $("#submission-" + res.id).slideDown("slow", function() {
          if ($("#alert").length) {
            $('.tooltipped').tooltip({delay: 50});
            document.getElementById('alert').play();
          }
        });
      }
    });
  }, 3000);
});

$(document).delegate('#toggle-audio', 'click', function() {
  if ($("#alert").length) {
    $("#alert").remove();
    $(this).html("Enable Audio");
  }
  else {
    $("body").prepend('<audio controls id="alert" style="display: none;"><source src="/audio/alert.ogg" type="audio/ogg"></audio>');
    $(this).html("Disable Audio");
  }
});

$(document).delegate('#toggle-feed', 'click', function() {
  arraydata = [];
  $("#data").empty();
  if (track == "comments") {
    track = "new";
    $(this).html("Show Comments");
  } else {
    track = "comments";
    $(this).html("Show Posts");
  }
});

$(document).delegate('#clear-list', 'click', function() {
  arraydata = [];
  $("#data").html("");
});

$(document).delegate('#comment-macro select', 'change', function() {
  $("#comment-text").val($(this).val());
  $('#comment-text').trigger('autoresize');
  Materialize.updateTextFields();
});

$(document).delegate('#approve', "click", function() {
  var id = $(this).data("id");

  $.post("/admin/pusher/approve", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The submission was approved successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate('#remove', "click", function() {
  var id = $(this).data("id");

  $.post("/admin/pusher/remove", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The submission was removed successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate('#lock', "click", function() {
  var id = $(this).data("id");

  $.post("/admin/pusher/lock", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The submission was locked successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate('#comment', "click", function() {
  var id = $(this).data("id");

  $('#submit-comment').data("id", id);
  $('#modal-comment').modal('open');
});

$(document).delegate('#flair', "click", function() {
  var id = $(this).data("id");

  $('#submit-flair').data("id", id);
  $('#modal-flair').modal('open');
});

$(document).delegate('#submit-comment', "click", function() {
  var id = $(this).data("id"),
      distinguish = $("#comment-distinguish").is(":checked"),
      text = $("#comment-text").val();

  $("#comment-distinguish").prop("checked", true);
  $("#comment-text").val("");
  $("#comment-macro select").val("");
  $('#comment-text').trigger('autoresize');
  $('select').material_select();
  Materialize.updateTextFields();

  $.post("/admin/pusher/comment", {
    id: id,
    distinguish: distinguish,
    text: text
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The comment was submitted successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate('#submit-flair', "click", function() {
  var id = $(this).data("id"),
      text = $("#link-flair select option:selected").data("text"),
      css = $("#link-flair select option:selected").data("css");

  $("#link-flair select").val("");
  $('select').material_select();

  $.post("/admin/pusher/flair", {
    id: id,
    text: text,
    css: css
  }, function(data) {
    if (data.message == "success") {
      Materialize.toast("The link flair was set successfully.", 4000, "rounded");
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
