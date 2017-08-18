$(document).ready(function() {
  $.post('/error/user', function(data) {
    var name = data.channel.name;
    $("#video-wrapper").html('<iframe src="http://player.twitch.tv/?channel=' + name + '"height="100%" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>');
    $("#chat-wrapper").html('<iframe frameborder="0" scrolling="no" id="' + name + '" src="http://www.twitch.tv/' + name + '/chat" height="100%" width="100%"</iframe>');
  });
});
