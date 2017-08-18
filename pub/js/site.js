$(document).ready(function(){
  $('.modal').modal();
  $('select').material_select();
  $('ul.tabs').tabs();
  $('.tooltipped').tooltip({delay: 50});
  $(".button-collapse").sideNav();
  $('.carousel.carousel-slider').carousel({full_width: true, indicators: true});
});

$(document).delegate("#preview-stream", "click", function() {
  var name = $(this).data("name");
  $("#modal-stream .modal-content").html('<iframe src="http://player.twitch.tv/?channel=' + name + '"height="100%" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>');
  $("#modal-stream #preview-profile").prop("href", "/user/" + name);
});

$(document).delegate(".modal-overlay", "click", function() {
  $("#modal-stream .modal-content").html('');
  $("#modal-stream #preview-profile").prop("href", "");
});

$(document).delegate("#nightmode", "click", function() {
  if ($("body").hasClass("night")) {
    $("body").removeClass("night");
  }
  else {
    $("body").addClass("night");
  }
  $.post("/nightmode");
});
