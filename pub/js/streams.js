$(document).ready(function() {
  $.post("/browse/streams/directories", {
    order: "viewers"
  }, function(data) {
    $("#directory-wrapper").append(data);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });
  $.post("/browse/streams/communities", {
    order: "viewers"
  }, function(data) {
    $("#community-wrapper").append(data);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });

  var slider = document.getElementById('viewers-options-range'),
      min = $("#tab-viewers").data("min"),
      max = $("#tab-viewers").data("max");
  if (min < max) {
    noUiSlider.create(slider, {
      start: [min, max],
      connect: true,
      step: 1,
      orientation: "horizontal",
      tooltips: true,
      range: {
        'min': min,
        'max': max
      },
      format: wNumb({
       decimals: 0
      })
    });
  }
  else {
    noUiSlider.create(slider, {
      start: [0, 1],
      connect: true,
      step: 1,
      orientation: "horizontal",
      tooltips: true,
      range: {
        'min': 0,
        'max': 1
      },
      format: wNumb({
       decimals: 0
      })
    });
  }

  slider.noUiSlider.on('set', function() {
    var min = slider.noUiSlider.get()[0],
        max = slider.noUiSlider.get()[1],
        order;
    if ($("#viewers-options-order").is(":checked")) {
      order = "ascending";
    }
    else {
      order = "descending";
    }
    $.post("/browse/streams/viewers", {
      offset: 0,
      order: order,
      min: min,
      max: max
    }, function(data) {
      $("#viewers-wrapper").html(data);
      $('.collapsible').collapsible();
    });
  });

  $(document).delegate("#viewers-options-order", "change", function() {
    var min = slider.noUiSlider.get()[0],
        max = slider.noUiSlider.get()[1],
        order;
    if ($("#viewers-options-order").is(":checked")) {
      order = "ascending";
    }
    else {
      order = "descending";
    }
    $.post("/browse/streams/viewers", {
      offset: 0,
      order: order,
      min: min,
      max: max
    }, function(data) {
      $("#viewers-wrapper").html(data);
      $('.collapsible').collapsible();
    });
  });

  $(document).delegate("#length-options-order", "change", function() {
    var order;
    if ($("#length-options-order").is(":checked")) {
      order = "ascending";
    }
    else {
      order = "descending";
    }
    $.post("/browse/streams/length", {
      offset: 0,
      order: order
    }, function(data) {
      $("#length-wrapper").html(data);
      $('.collapsible').collapsible();
    });
  });

  $(document).delegate("#directory-options-order", "change", function() {
    var order;
    if ($("#directory-options-order").is(":checked")) {
      order = "az";
    }
    else {
      order = "viewers";
    }
    $.post("/browse/streams/directories", {
      order: order
    }, function(data) {
      $("#directory-wrapper").html(data);
      $('.collapsible').collapsible();
      $('.tooltipped').tooltip({delay: 50});
    });
  });

  $(document).delegate("#community-options-order", "change", function() {
    var order;
    if ($("#community-options-order").is(":checked")) {
      order = "az";
    }
    else {
      order = "viewers";
    }
    $.post("/browse/streams/communities", {
      order: order
    }, function(data) {
      $("#community-wrapper").html(data);
      $('.collapsible').collapsible();
      $('.tooltipped').tooltip({delay: 50});
    });
  });

  $(document).delegate(window, "scroll", function() {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      $(window).unbind("scroll");
      var offset;
      if ($("#tab-twoos").is(".active")) {
        offset = $("#twoos-wrapper>.col>.col>.col").size();
        $.post("/browse/streams/twoos", {
          offset: offset
        }, function(data) {
          $("#twoos-wrapper").append(data);
          $('.collapsible').collapsible();
        });
      }
      else if ($("#tab-votes").is(".active")) {
        offset = $("#votes-wrapper>.col>.col>.col").size();
        $.post("/browse/streams/votes", {
          offset: offset
        }, function(data) {
          $("#votes-wrapper").append(data);
          $('.collapsible').collapsible();
        });
      }
      else if ($("#tab-random").is(".active")) {
        var ids = $("#tab-random .card").map(function() {
          return $(this).data("id");
        }).get();
        $.post("/browse/streams/random", {
          ids: ids
        }, function(data) {
          $("#random-wrapper").append(data);
          $('.collapsible').collapsible();
        });
      }
      else if ($("#tab-length").is(".active")) {
        var order;
        if ($("#length-options-order").is(":checked")) {
          order = "ascending";
        }
        else {
          order = "descending";
        }
        offset = $("#length-wrapper>.col>.col>.col").size();
        $.post("/browse/streams/length", {
          offset: offset,
          order: order
        }, function(data) {
          $("#length-wrapper").append(data);
          $('.collapsible').collapsible();
        });
      }
      else if ($("#tab-viewers").is(".active")) {
        var min = slider.noUiSlider.get()[0],
            max = slider.noUiSlider.get()[1],
            offset = $("#viewers-wrapper>.col>.col>.col").size(),
            order;
        if ($("#viewers-options-order").is(":checked")) {
          order = "ascending";
        }
        else {
          order = "descending";
        }
        $.post("/browse/streams/viewers", {
          offset: offset,
          order: order,
          min: min,
          max: max
        }, function(data) {
          $("#viewers-wrapper").append(data);
          $('.collapsible').collapsible();
        });
      }
    }
  });

  $(document).delegate(".directory-thumbnail", "click", function() {
    var name = $(this).data("name"),
        encode = encodeURI(name).replace(/%/g, "").replace(/\'/g, "").replace(/\:/g, "3A"),
        done = false;

    if (!done && !$(this).is(".active")) {
      $(this).addClass("active");
      done = true;
      $.post("/browse/streams/directory", {
        directory: name
      }, function(data) {
        $("#directory-streams").append(data);
        var streamers = $("#directory-streams>.col>.col>.col").size();
        $(".directory-thumbnail").parent().slideUp("fast", function() {
          $(".directory-thumbnail:not([id*=\"" + encode + "\"])").hide();
          $("#directory-thumbnail-" + encode).parent().hide();
          if (streamers !== 1) {
            var word1 = "are";
          }
          else {
            var word1 = "is";
          }
          if (streamers !== 1) {
            var word2 = "streamers";
          }
          else {
            var word2 = "streamer";
          }
          $("#directory-thumbnail-" + encode).parent().prepend('<div id="directory-information" class="col l10 m8 s6"><div class="card" style="margin: 0;"><div class="card-content"><h4 class="center">' + name + '</h4><br><h5 class="center">There ' + word1 + ' ' + streamers + ' ' + word2 + ' in this directory.</h5></div></div></div>');
          $("#directory-thumbnail-" + encode).parent().prepend('<div id="directory-back" class="col l1 m2 s3"><div class="card" style="margin-bottom: 0;"><div class="card-image black"><img class="responsive-img" src="/img/back.png"></div></div></div>');
          $("#directory-thumbnail-" + encode).parent().show("slide", { direction: "left" }, 500, function() {
            $("#directory-thumbnail-" + encode).parent().attr("style", "display: flex;");
            $("#directory-streams").slideDown();
          });
        });
      });
    }
  });

  $(document).delegate("#directory-back", "click", function() {
    $(".directory-streams").slideUp(function() {
      $(".directory-thumbnail").parent().hide("slide", { direction: "right" }, 500, function() {
        $("#directory-information").remove();
        $("#directory-back").remove();
        $(".directory-thumbnail").removeClass("active");
        $(".directory-thumbnail").hide();
        $("#directory-streams").html("");
        $(".directory-thumbnail").parent().show(function() {
          $(".directory-thumbnail").slideDown();
        });
      });
    });
  });

  $(document).delegate(".community-thumbnail", "click", function() {
    var id = $(this).data("id"),
        name = $(this).data("name"),
        encode = encodeURI(name).replace(/%/g, "").replace(/\'/g, "").replace(/\:/g, "3A"),
        done = false;

    if (!done && !$(this).is(".active")) {
      $(this).addClass("active");
      done = true;
      $.post("/browse/streams/community", {
        community: id
      }, function(data) {
        $("#community-streams").append(data);
        var streamers = $("#community-streams>.col>.col>.col").size();
        $(".community-thumbnail").parent().slideUp("fast", function() {
          $(".community-thumbnail:not([id*=\"" + encode + "\"])").hide();
          $("#community-thumbnail-" + encode).parent().hide();
          if (streamers !== 1) {
            var word1 = "are";
          }
          else {
            var word1 = "is";
          }
          if (streamers !== 1) {
            var word2 = "streamers";
          }
          else {
            var word2 = "streamer";
          }
          $("#community-thumbnail-" + encode).parent().prepend('<div id="community-information" class="col l10 m8 s6" style="max-height: 100%; margin: 0;"><div class="card" style="max-height: 100%;"><div class="card-content"><h4 class="center">' + name + '</h4><br><h5 class="center">There ' + word1 + ' ' + streamers + ' ' + word2 + ' in this community.</h5></div></div></div>');
          $("#community-thumbnail-" + encode).parent().prepend('<div id="community-back" class="col l1 m2 s3"><div class="card" style="margin-bottom: 0;"><div class="card-image black"><img class="responsive-img" src="/img/back.png"></div></div></div>');
          $("#community-thumbnail-" + encode).parent().show("slide", { direction: "left" }, 500, function() {
            $("#community-thumbnail-" + encode).parent().attr("style", "display: flex;");
            $("#community-streams").slideDown();
          });
        });
      });
    }
  });

  $(document).delegate("#community-back", "click", function() {
    $(".community-streams").slideUp(function() {
      $(".community-thumbnail").parent().hide("slide", { direction: "right" }, 500, function() {
        $("#community-information").remove();
        $("#community-back").remove();
        $(".community-thumbnail").removeClass("active");
        $(".community-thumbnail").hide();
        $("#community-streams").html("");
        $(".community-thumbnail").parent().show(function() {
          $(".community-thumbnail").slideDown();
        });
      });
    });
  });

  $(document).delegate("[href='#tab-twoos'], [href='#tab-votes'], [href='#tab-random']", "click", function() {
    $("#length-options").hide();
    $("#directory-options").hide();
    $("#community-options").hide();
    $("#viewers-options").hide();
    $(".tabs").css("margin-bottom", "-20px");
  });

  $(document).delegate("[href='#tab-length']", "click", function() {
    $("#length-options").show();
    $("#directory-options").hide();
    $("#community-options").hide();
    $("#viewers-options").hide();
    $(".tabs").css("margin-bottom", "0");
  });

  $(document).delegate("[href='#tab-directory']", "click", function() {
    $("#length-options").hide();
    $("#directory-options").show();
    $("#community-options").hide();
    $("#viewers-options").hide();
    $(".tabs").css("margin-bottom", "0");
  });

  $(document).delegate("[href='#tab-community']", "click", function() {
    $("#length-options").hide();
    $("#directory-options").hide();
    $("#community-options").show();
    $("#viewers-options").hide();
    $(".tabs").css("margin-bottom", "0");
  });

  $(document).delegate("[href='#tab-viewers']", "click", function() {
    $("#length-options").hide();
    $("#directory-options").hide();
    $("#community-options").hide();
    $("#viewers-options").show();
    $(".tabs").css("margin-bottom", "0");
  });
});
