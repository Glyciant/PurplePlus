$(document).ready(function() {
  setInterval(function() {
    $('.carousel').carousel('next');
  }, 10000);

  $(".col").fadeIn(1000);
});
