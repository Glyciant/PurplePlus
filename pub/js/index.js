$(document).ready(function() {
  var interval = setInterval(function() {
    $(".carousel").carousel("next");
  }, 10000);

  $(".col").fadeIn(1000);

  $(document).delegate("#back", "click", function() {
    $(".carousel").carousel("prev");
    clearTimeout(interval);
    interval = setInterval(function() {
      $(".carousel").carousel("next");
    }, 10000);
  });

  $(document).delegate("#next", "click", function() {
    $(".carousel").carousel("next");
    clearTimeout(interval);
    interval = setInterval(function() {
      $(".carousel").carousel("next");
    }, 10000);
  });

  $(document).delegate("#carousel-wrapper", "mousedown", function() {
    clearTimeout(interval);
    interval = setInterval(function() {
      $(".carousel").carousel("next");
    }, 10000);
  });
});
