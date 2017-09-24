$(document).ready(function(){
  $('.modal').modal();
  $('select').material_select();
  $('ul.tabs').tabs();
  $('.tooltipped').tooltip({delay: 50});
  $(".button-collapse").sideNav();
  $('.carousel.carousel-slider').carousel({full_width: true, indicators: true});
  if ($(window).height() < 850) {
    $(".carousel .indicators").remove();
  }
  $('.scrollspy').scrollSpy();
  $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 1,
    today: 'Today',
    clear: 'Clear',
    close: 'OK',
    closeOnSelect: false
  });
  $('.timepicker').pickatime({
    default: 'now',
    fromnow: 0,
    twelvehour: true,
    donetext: 'OK',
    cleartext: 'Clear',
    canceltext: 'Cancel',
    autoclose: false,
    ampmclickable: true
  });
});

$(document).delegate("#preview-stream", "click", function() {
  var name = $(this).data("name");
  $("#modal-stream .modal-content").html('<iframe src="https://player.twitch.tv/?channel=' + name + '"height="100%" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>');
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

$(document).delegate("#icons", "click", function() {
  $.post("/icons");
  location.reload();
});
