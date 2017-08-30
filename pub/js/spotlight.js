$(document).ready(function() {
  var options = [],
      name,
      username,
      directory,
      twitter;
  if ($("#spotlight-streamer-gaming").data("name")) {
    options.push(1);
  }
  if ($("#spotlight-streamer-creative").data("name")) {
    options.push(2);
  }
  if ($("#spotlight-streamer-irl").data("name")) {
    options.push(3);
  }
  if ($("#spotlight-streamer-socialeating").data("name")) {
    options.push(4);
  }
  if ($("#spotlight-streamer-talkshow").data("name")) {
    options.push(5);
  }
  if ($("#spotlight-streamer-music").data("name")) {
    options.push(6);
  }
  var random = options[Math.floor(Math.random() * options.length)];
  if (random === 1) {
    name = $("#spotlight-streamer-gaming").data("name");
    username = $("#spotlight-streamer-gaming").data("username");
    directory = $("#spotlight-streamer-gaming").data("directory");
    twitter = $("#spotlight-streamer-gaming").data("twitter");
    $("#spotlight-streamer-gaming #spotlight-preview").addClass("active");
  }
  else if (random === 2) {
    name = $("#spotlight-streamer-creative").data("name");
    username = $("#spotlight-streamer-creative").data("username");
    directory = $("#spotlight-streamer-creative").data("directory");
    twitter = $("#spotlight-streamer-creative").data("twitter");
    $("#spotlight-streamer-creative #spotlight-preview").addClass("active");
  }
  else if (random === 3) {
    name = $("#spotlight-streamer-irl").data("name");
    username = $("#spotlight-streamer-irl").data("username");
    directory = $("#spotlight-streamer-irl").data("directory");
    twitter = $("#spotlight-streamer-irl").data("twitter");
    $("#spotlight-streamer-irl #spotlight-preview").addClass("active");
  }
  else if (random === 4) {
    name = $("#spotlight-streamer-socialeating").data("name");
    username = $("#spotlight-streamer-socialeating").data("username");
    directory = $("#spotlight-streamer-socialeating").data("directory");
    twitter = $("#spotlight-streamer-socialeating").data("twitter");
    $("#spotlight-streamer-socialeating #spotlight-preview").addClass("active");
  }
  else if (random === 5) {
    name = $("#spotlight-streamer-talkshow").data("name");
    username = $("#spotlight-streamer-talkshow").data("username");
    directory = $("#spotlight-streamer-talkshow").data("directory");
    twitter = $("#spotlight-streamer-talkshow").data("twitter");
    $("#spotlight-streamer-talkshow #spotlight-preview").addClass("active");
  }
  else if (random === 6) {
    name = $("#spotlight-streamer-music").data("name");
    username = $("#spotlight-streamer-music").data("username");
    directory = $("#spotlight-streamer-music").data("directory");
    twitter = $("#spotlight-streamer-music").data("twitter");
    $("#spotlight-streamer-music #spotlight-preview").addClass("active");
  }
  $("#spotlight-channel").html(name);
  $("#spotlight-directory").html(directory);
  $("#spotlight-player-wrapper").html('<iframe src="https://player.twitch.tv/?channel=\'' + username + '\'"height="100%"width="100%"frameborder="0"scrolling="no"allowfullscreen="true"></iframe>');
  $("#spotlight-stream-profile").prop("href", "/user/" + username);
  $("#spotlight-stream-channel").prop("href", "https://twitch.tv/" + username);
  $("#spotlight-stream-player").prop("href", "https://player.twitch.tv/?volume=1&channel=" + username);
  $("#spotlight-stream-chat").prop("href", "https://twitch.tv/" + username + "/chat");
  if (twitter) {
    $("#spotlight-stream-tweet").prop("href", "https://twitter.com/intent/tweet?text=I%27m+watching+%40" + twitter + "+stream+" + directory + "+on+%40Twitch.+Come+and+join+me%21%0D%0A%0D%0Ahttps%3A%2F%2Ftwitch.tv%2F" + username + "%0D%0A%0D%0A%28via+Purple%2B%29");
  }
  else {
    $("#spotlight-stream-tweet").prop("href", "https://twitter.com/intent/tweet?text=I%27m+watching+" + name + "+stream+" + directory + "+on+%40Twitch.+Come+and+join+me%21%0D%0A%0D%0Ahttps%3A%2F%2Ftwitch.tv%2F" + username + "%0D%0A%0D%0A%28via+Purple%2B%29");
  }
});

$(document).delegate("#random-stream", "click", function() {
  var i = 0,
      options = [];

  if ($("#spotlight-streamer-gaming").data("name") && $("#spotlight-streamer-gaming #spotlight-preview").is(":not(.active)")) {
    options.push(1);
  }
  if ($("#spotlight-streamer-creative").data("name") && $("#spotlight-streamer-creative #spotlight-preview").is(":not(.active)")) {
    options.push(2);
  }
  if ($("#spotlight-streamer-irl").data("name") && $("#spotlight-streamer-irl #spotlight-preview").is(":not(.active)")) {
    options.push(3);
  }
  if ($("#spotlight-streamer-socialeating").data("name") && $("#spotlight-streamer-socialeating #spotlight-preview").is(":not(.active)")) {
    options.push(4);
  }
  if ($("#spotlight-streamer-talkshow").data("name") && $("#spotlight-streamer-talkshow #spotlight-preview").is(":not(.active)")) {
    options.push(5);
  }
  if ($("#spotlight-streamer-music").data("name") && $("#spotlight-streamer-music #spotlight-preview").is(":not(.active)")) {
    options.push(6);
  }
  var shuffle = setInterval(function() {
    var random = options[Math.floor(Math.random() * options.length)];
    $("#spotlight-preview.active").removeClass("active");
    if (random === 1) {
      $("#spotlight-streamer-gaming #spotlight-preview").addClass("active");
    }
    else if (random === 2) {
      $("#spotlight-streamer-creative #spotlight-preview").addClass("active");
    }
    else if (random === 3) {
      $("#spotlight-streamer-irl #spotlight-preview").addClass("active");
    }
    else if (random === 4) {
      $("#spotlight-streamer-socialeating #spotlight-preview").addClass("active");
    }
    else if (random === 5) {
      $("#spotlight-streamer-talkshow #spotlight-preview").addClass("active");
    }
    else if (random === 6) {
      $("#spotlight-streamer-music #spotlight-preview").addClass("active");
    }
    i++;
    if (i >= 10) {
      clearInterval(shuffle);
      var selection = $("#spotlight-preview.active").parent().parent();
      $("#spotlight-channel").html(selection.data("name"));
      $("#spotlight-directory").html(selection.data("directory"));
      $("#spotlight-player-wrapper").html('<iframe src="https://player.twitch.tv/?channel=\'' + selection.data("username") + '\'"height="100%"width="100%"frameborder="0"scrolling="no"allowfullscreen="true"></iframe>');
      $("#spotlight-stream-profile").prop("href", "/user/" + selection.data("username"));
      $("#spotlight-stream-channel").prop("href", "https://twitch.tv/" + selection.data("username"));
      $("#spotlight-stream-player").prop("href", "https://player.twitch.tv/?volume=1&channel=" + selection.data("username"));
      $("#spotlight-stream-chat").prop("href", "https://twitch.tv/" + selection.data("username") + "/chat");
      if (selection.data("twitter")) {
        $("#spotlight-stream-tweet").prop("href", "https://twitter.com/intent/tweet?text=I%27m+watching+%40" + selection.data("twitter") + "+stream+" + selection.data("directory") + "+on+%40Twitch.+Come+and+join+me%21%0D%0A%0D%0Ahttps%3A%2F%2Ftwitch.tv%2F" + selection.data("username") + "%0D%0A%0D%0A%28via+Purple%2B%29");
      }
      else {
        $("#spotlight-stream-tweet").prop("href", "https://twitter.com/intent/tweet?text=I%27m+watching+" + selection.data("name") + "+stream+" + selection.data("directory") + "+on+%40Twitch.+Come+and+join+me%21%0D%0A%0D%0Ahttps%3A%2F%2Ftwitch.tv%2F" + selection.data("username") + "%0D%0A%0D%0A%28via+Purple%2B%29");
      }
    }
  }, 200);
});

$(document).delegate("#new-streams", "click", function() {
  location.reload();
});

$(document).delegate("#spotlight-preview", "click", function() {
  $("#spotlight-preview.active").removeClass("active");
  $(this).addClass("active");
  var selection = $(this).parent().parent();
  $("#spotlight-channel").html(selection.data("name"));
  $("#spotlight-directory").html(selection.data("directory"));
  $("#spotlight-player-wrapper").html('<iframe src="https://player.twitch.tv/?channel=\'' + selection.data("username") + '\'"height="100%"width="100%"frameborder="0"scrolling="no"allowfullscreen="true"></iframe>');
  $("#spotlight-stream-profile").prop("href", "/user/" + selection.data("username"));
  $("#spotlight-stream-channel").prop("href", "https://twitch.tv/" + selection.data("username"));
  $("#spotlight-stream-player").prop("href", "https://player.twitch.tv/?volume=1&channel=" + selection.data("username"));
  $("#spotlight-stream-chat").prop("href", "https://twitch.tv/" + selection.data("username") + "/chat");
  if (selection.data("twitter")) {
    $("#spotlight-stream-tweet").prop("href", "https://twitter.com/intent/tweet?text=I%27m+watching+%40" + selection.data("twitter") + "+stream+" + selection.data("directory") + "+on+%40Twitch.+Come+and+join+me%21%0D%0A%0D%0Ahttps%3A%2F%2Ftwitch.tv%2F" + selection.data("username") + "%0D%0A%0D%0A%28via+Purple%2B%29");
  }
  else {
    $("#spotlight-stream-tweet").prop("href", "https://twitter.com/intent/tweet?text=I%27m+watching+" + selection.data("name") + "+stream+" + selection.data("directory") + "+on+%40Twitch.+Come+and+join+me%21%0D%0A%0D%0Ahttps%3A%2F%2Ftwitch.tv%2F" + selection.data("username") + "%0D%0A%0D%0A%28via+Purple%2B%29");
  }
});

$(document).delegate("[href='#tab-streamers']", "click", function() {
  $("#spotlight-stream-message").show();
});

$(document).delegate("[href='#tab-other']", "click", function() {
  $("#spotlight-stream-message").hide();
});
