$(document).ready(function() {
  $('.chips').material_chip();

  var i = $("#query-attributes-overview-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-overview-keywords').material_chip({ data: k });

  var i = $("#query-attributes-streamer-gaming-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-streamer-gaming-keywords').material_chip({ data: k });

  var i = $("#query-attributes-streamer-creative-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-streamer-creative-keywords').material_chip({ data: k });

  var i = $("#query-attributes-streamer-irl-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-streamer-irl-keywords').material_chip({ data: k });

  var i = $("#query-attributes-streamer-socialeating-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-streamer-socialeating-keywords').material_chip({ data: k });

  var i = $("#query-attributes-streamer-talkshow-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-streamer-talkshow-keywords').material_chip({ data: k });

  var i = $("#query-attributes-streamer-music-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-streamer-music-keywords').material_chip({ data: k });

  var i = $("#query-attributes-artist-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-artist-keywords').material_chip({ data: k });

  var i = $("#query-attributes-developer-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-developer-keywords').material_chip({ data: k });

  var i = $("#query-attributes-communitymanager-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-communitymanager-keywords').material_chip({ data: k });

  var i = $("#query-attributes-moderator-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-moderator-keywords').material_chip({ data: k });

  var i = $("#query-attributes-viewer-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-viewer-keywords').material_chip({ data: k });

  var i = $("#query-attributes-other-keywords").data("keywords").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-attributes-other-keywords').material_chip({ data: k });

  var i = $("#query-tags").data("tags").split(","),
      k = [];
  for (var word of i) {
    k.push({ tag: word });
  }
  $('#query-tags').material_chip({ data: k });

  if ($("#query-type-streamer-gaming").prop("checked") === true && $("#query-type-streamer-creative").prop("checked") === true && $("#query-type-streamer-irl").prop("checked") === true && $("#query-type-streamer-socialeating").prop("checked") === true && $("#query-type-streamer-talkshow").prop("checked") === true && $("#query-type-streamer-music").prop("checked") === true && $("#query-type-artist").prop("checked") === true && $("#query-type-developer").prop("checked") === true && $("#query-type-communitymanager").prop("checked") === true && $("#query-type-moderator").prop("checked") === true && $("#query-type-viewer").prop("checked") === true && $("#query-type-other").prop("checked") === true) {
    $("#query-type-select-all").prop("checked", true);
  }

  if ($("#query-attributes-streamer-gaming-action").is(":checked") === true && $("#query-attributes-streamer-gaming-adventure").is(":checked") === true && $("#query-attributes-streamer-gaming-horror").is(":checked") === true && $("#query-attributes-streamer-gaming-roleplaying").is(":checked") === true && $("#query-attributes-streamer-gaming-simulation").is(":checked") === true && $("#query-attributes-streamer-gaming-strategy").is(":checked") === true && $("#query-attributes-streamer-gaming-survival").is(":checked") === true && $("#query-attributes-streamer-gaming-other").is(":checked") === true) {
    $("#query-attributes-streamer-gaming-select-all").prop("checked", true);
  }

  if ($("#query-attributes-streamer-creative-cooking").is(":checked") === true && $("#query-attributes-streamer-creative-drawing").is(":checked") === true && $("#query-attributes-streamer-creative-painting").is(":checked") === true && $("#query-attributes-streamer-creative-programming").is(":checked") === true && $("#query-attributes-streamer-creative-editing").is(":checked") === true && $("#query-attributes-streamer-creative-other").is(":checked") === true) {
    $("#query-attributes-streamer-creative-select-all").prop("checked", true);
  }

  if ($("#query-attributes-viewer-streams-action").is(":checked") && $("#query-attributes-viewer-streams-adventure").is(":checked") && $("#query-attributes-viewer-streams-roleplaying").is(":checked") && $("#query-attributes-viewer-streams-simulation").is(":checked") && $("#query-attributes-viewer-streams-horror").is(":checked") && $("#query-attributes-viewer-streams-strategy").is(":checked") && $("#query-attributes-viewer-streams-survival").is(":checked") && $("#query-attributes-viewer-streams-cooking").is(":checked") && $("#query-attributes-viewer-streams-drawing").is(":checked") && $("#query-attributes-viewer-streams-painting").is(":checked") && $("#query-attributes-viewer-streams-programming").is(":checked") && $("#query-attributes-viewer-streams-editing").is(":checked") && $("#query-attributes-viewer-streams-irl").is(":checked") && $("#query-attributes-viewer-streams-talkshow").is(":checked") && $("#query-attributes-viewer-streams-socialeating").is(":checked") && $("#query-attributes-viewer-streams-music").is(":checked")) {
    $("#query-attributes-viewer-select-all").prop("checked", true);
  }
});

$(document).delegate("#query-type-select-all", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-type-streamer-gaming").prop("checked", true);
    $("#query-type-streamer-creative").prop("checked", true);
    $("#query-type-streamer-irl").prop("checked", true);
    $("#query-type-streamer-socialeating").prop("checked", true);
    $("#query-type-streamer-talkshow").prop("checked", true);
    $("#query-type-streamer-music").prop("checked", true);
    $("#query-type-artist").prop("checked", true);
    $("#query-type-developer").prop("checked", true);
    $("#query-type-communitymanager").prop("checked", true);
    $("#query-type-moderator").prop("checked", true);
    $("#query-type-viewer").prop("checked", true);
    $("#query-type-other").prop("checked", true);
    $("#query-attributes-initial").slideUp();
    $("#query-attributes-streamer-gaming").slideDown();
    $("#query-attributes-streamer-creative").slideDown();
    $("#query-attributes-streamer-irl").slideDown();
    $("#query-attributes-streamer-socialeating").slideDown();
    $("#query-attributes-streamer-talkshow").slideDown();
    $("#query-attributes-streamer-music").slideDown();
    $("#query-attributes-artist").slideDown();
    $("#query-attributes-developer").slideDown();
    $("#query-attributes-communitymanager").slideDown();
    $("#query-attributes-moderator").slideDown();
    $("#query-attributes-viewer").slideDown();
    $("#query-attributes-other").slideDown();
  }
  else {
    $("#query-type-streamer-gaming").prop("checked", false);
    $("#query-type-streamer-creative").prop("checked", false);
    $("#query-type-streamer-irl").prop("checked", false);
    $("#query-type-streamer-socialeating").prop("checked", false);
    $("#query-type-streamer-talkshow").prop("checked", false);
    $("#query-type-streamer-music").prop("checked", false);
    $("#query-type-artist").prop("checked", false);
    $("#query-type-developer").prop("checked", false);
    $("#query-type-communitymanager").prop("checked", false);
    $("#query-type-moderator").prop("checked", false);
    $("#query-type-viewer").prop("checked", false);
    $("#query-type-other").prop("checked", false);
    $("#query-attributes-initial").slideDown();
    $("#query-attributes-streamer-gaming").slideUp();
    $("#query-attributes-streamer-creative").slideUp();
    $("#query-attributes-streamer-irl").slideUp();
    $("#query-attributes-streamer-socialeating").slideUp();
    $("#query-attributes-streamer-talkshow").slideUp();
    $("#query-attributes-streamer-music").slideUp();
    $("#query-attributes-artist").slideUp();
    $("#query-attributes-developer").slideUp();
    $("#query-attributes-communitymanager").slideUp();
    $("#query-attributes-moderator").slideUp();
    $("#query-attributes-viewer").slideUp();
    $("#query-attributes-other").slideUp();
  }
});

$("#query-type").delegate("input", "change", function() {
  if ($("#query-type-streamer-gaming").prop("checked") === true && $("#query-type-streamer-creative").prop("checked") === true && $("#query-type-streamer-irl").prop("checked") === true && $("#query-type-streamer-socialeating").prop("checked") === true && $("#query-type-streamer-talkshow").prop("checked") === true && $("#query-type-streamer-music").prop("checked") === true && $("#query-type-artist").prop("checked") === true && $("#query-type-developer").prop("checked") === true && $("#query-type-communitymanager").prop("checked") === true && $("#query-type-moderator").prop("checked") === true && $("#query-type-viewer").prop("checked") === true && $("#query-type-other").prop("checked") === true) {
    $("#query-type-select-all").prop("checked", true);
  }
  else {
    $("#query-type-select-all").prop("checked", false);
  }
});

$(document).delegate("#query-attributes-streamer-gaming-select-all", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-gaming-action").prop("checked", true);
    $("#query-attributes-streamer-gaming-adventure").prop("checked", true);
    $("#query-attributes-streamer-gaming-horror").prop("checked", true);
    $("#query-attributes-streamer-gaming-roleplaying").prop("checked", true);
    $("#query-attributes-streamer-gaming-simulation").prop("checked", true);
    $("#query-attributes-streamer-gaming-strategy").prop("checked", true);
    $("#query-attributes-streamer-gaming-survival").prop("checked", true);
    $("#query-attributes-streamer-gaming-other").prop("checked", true);
  }
  else {
    $("#query-attributes-streamer-gaming-action").prop("checked", false);
    $("#query-attributes-streamer-gaming-adventure").prop("checked", false);
    $("#query-attributes-streamer-gaming-horror").prop("checked", false);
    $("#query-attributes-streamer-gaming-roleplaying").prop("checked", false);
    $("#query-attributes-streamer-gaming-simulation").prop("checked", false);
    $("#query-attributes-streamer-gaming-strategy").prop("checked", false);
    $("#query-attributes-streamer-gaming-survival").prop("checked", false);
    $("#query-attributes-streamer-gaming-other").prop("checked", false);
  }
});

$("#query-attributes-streamer-gaming").delegate("input:not(#query-attributes-streamer-gaming-select-all)", "change", function() {
  if ($("#query-attributes-streamer-gaming-action").is(":checked") === true && $("#query-attributes-streamer-gaming-adventure").is(":checked") === true && $("#query-attributes-streamer-gaming-horror").is(":checked") === true && $("#query-attributes-streamer-gaming-roleplaying").is(":checked") === true && $("#query-attributes-streamer-gaming-simulation").is(":checked") === true && $("#query-attributes-streamer-gaming-strategy").is(":checked") === true && $("#query-attributes-streamer-gaming-survival").is(":checked") === true && $("#query-attributes-streamer-gaming-other").is(":checked") === true) {
    $("#query-attributes-streamer-gaming-select-all").prop("checked", true);
  }
  else {
    $("#query-attributes-streamer-gaming-select-all").prop("checked", false);
  }
});

$(document).delegate("#query-attributes-streamer-creative-select-all", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-creative-cooking").prop("checked", true);
    $("#query-attributes-streamer-creative-drawing").prop("checked", true);
    $("#query-attributes-streamer-creative-painting").prop("checked", true);
    $("#query-attributes-streamer-creative-programming").prop("checked", true);
    $("#query-attributes-streamer-creative-editing").prop("checked", true);
    $("#query-attributes-streamer-creative-other").prop("checked", true);
  }
  else {
    $("#query-attributes-streamer-creative-cooking").prop("checked", false);
    $("#query-attributes-streamer-creative-drawing").prop("checked", false);
    $("#query-attributes-streamer-creative-painting").prop("checked", false);
    $("#query-attributes-streamer-creative-programming").prop("checked", false);
    $("#query-attributes-streamer-creative-editing").prop("checked", false);
    $("#query-attributes-streamer-creative-other").prop("checked", false);
  }
});

$("#query-attributes-streamer-creative").delegate("input:not(#query-attributes-streamer-creative-select-all)", "change", function() {
  if ($("#query-attributes-streamer-creative-cooking").is(":checked") === true && $("#query-attributes-streamer-creative-drawing").is(":checked") === true && $("#query-attributes-streamer-creative-painting").is(":checked") === true && $("#query-attributes-streamer-creative-programming").is(":checked") === true && $("#query-attributes-streamer-creative-editing").is(":checked") === true && $("#query-attributes-streamer-creative-other").is(":checked") === true) {
    $("#query-attributes-streamer-creative-select-all").prop("checked", true);
  }
  else {
    $("#query-attributes-streamer-creative-select-all").prop("checked", false);
  }
});

$(document).delegate("#query-attributes-viewer-select-all", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-viewer-streams-action").prop("checked", true);
    $("#query-attributes-viewer-streams-adventure").prop("checked", true);
    $("#query-attributes-viewer-streams-roleplaying").prop("checked", true);
    $("#query-attributes-viewer-streams-simulation").prop("checked", true);
    $("#query-attributes-viewer-streams-horror").prop("checked", true);
    $("#query-attributes-viewer-streams-strategy").prop("checked", true);
    $("#query-attributes-viewer-streams-survival").prop("checked", true);
    $("#query-attributes-viewer-streams-cooking").prop("checked", true);
    $("#query-attributes-viewer-streams-drawing").prop("checked", true);
    $("#query-attributes-viewer-streams-painting").prop("checked", true);
    $("#query-attributes-viewer-streams-programming").prop("checked", true);
    $("#query-attributes-viewer-streams-editing").prop("checked", true);
    $("#query-attributes-viewer-streams-irl").prop("checked", true);
    $("#query-attributes-viewer-streams-talkshow").prop("checked", true);
    $("#query-attributes-viewer-streams-socialeating").prop("checked", true);
    $("#query-attributes-viewer-streams-music").prop("checked", true);
  }
  else {
    $("#query-attributes-viewer-streams-action").prop("checked", false);
    $("#query-attributes-viewer-streams-adventure").prop("checked", false);
    $("#query-attributes-viewer-streams-roleplaying").prop("checked", false);
    $("#query-attributes-viewer-streams-simulation").prop("checked", false);
    $("#query-attributes-viewer-streams-horror").prop("checked", false);
    $("#query-attributes-viewer-streams-strategy").prop("checked", false);
    $("#query-attributes-viewer-streams-survival").prop("checked", false);
    $("#query-attributes-viewer-streams-cooking").prop("checked", false);
    $("#query-attributes-viewer-streams-drawing").prop("checked", false);
    $("#query-attributes-viewer-streams-painting").prop("checked", false);
    $("#query-attributes-viewer-streams-programming").prop("checked", false);
    $("#query-attributes-viewer-streams-editing").prop("checked", false);
    $("#query-attributes-viewer-streams-irl").prop("checked", false);
    $("#query-attributes-viewer-streams-talkshow").prop("checked", false);
    $("#query-attributes-viewer-streams-socialeating").prop("checked", false);
    $("#query-attributes-viewer-streams-music").prop("checked", false);
  }
});

$("#query-attributes-viewer").delegate("input:not(#query-attributes-viewer-select-all)", "change", function() {
  if ($("#query-attributes-viewer-streams-action").is(":checked") && $("#query-attributes-viewer-streams-adventure").is(":checked") && $("#query-attributes-viewer-streams-roleplaying").is(":checked") && $("#query-attributes-viewer-streams-simulation").is(":checked") && $("#query-attributes-viewer-streams-horror").is(":checked") && $("#query-attributes-viewer-streams-strategy").is(":checked") && $("#query-attributes-viewer-streams-survival").is(":checked") && $("#query-attributes-viewer-streams-cooking").is(":checked") && $("#query-attributes-viewer-streams-drawing").is(":checked") && $("#query-attributes-viewer-streams-painting").is(":checked") && $("#query-attributes-viewer-streams-programming").is(":checked") && $("#query-attributes-viewer-streams-editing").is(":checked") && $("#query-attributes-viewer-streams-irl").is(":checked") && $("#query-attributes-viewer-streams-talkshow").is(":checked") && $("#query-attributes-viewer-streams-socialeating").is(":checked") && $("#query-attributes-viewer-streams-music").is(":checked")) {
    $("#query-attributes-viewer-select-all").prop("checked", true);
  }
  else {
    $("#query-attributes-viewer-select-all").prop("checked", false);
  }
});

$(document).delegate("#query-public", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-description").prop("disabled", false);
  }
  else {
    $("#query-description").prop("disabled", true);
    $("#query-description").val();
  }
});


$(document).delegate("#query-type-streamer-gaming", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-gaming").slideDown();
  }
  else {
    $("#query-attributes-streamer-gaming").slideUp();
  }
});

$(document).delegate("#query-type-streamer-creative", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-creative").slideDown();
  }
  else {
    $("#query-attributes-streamer-creative").slideUp();
  }
});

$(document).delegate("#query-type-streamer-irl", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-irl").slideDown();
  }
  else {
    $("#query-attributes-streamer-irl").slideUp();
  }
});

$(document).delegate("#query-type-streamer-socialeating", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-socialeating").slideDown();
  }
  else {
    $("#query-attributes-streamer-socialeating").slideUp();
  }
});

$(document).delegate("#query-type-streamer-talkshow", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-talkshow").slideDown();
  }
  else {
    $("#query-attributes-streamer-talkshow").slideUp();
  }
});

$(document).delegate("#query-type-streamer-music", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-streamer-music").slideDown();
  }
  else {
    $("#query-attributes-streamer-music").slideUp();
  }
});

$(document).delegate("#query-type-artist", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-artist").slideDown();
  }
  else {
    $("#query-attributes-artist").slideUp();
  }
});

$(document).delegate("#query-type-developer", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-developer").slideDown();
  }
  else {
    $("#query-attributes-developer").slideUp();
  }
});


$(document).delegate("#query-type-communitymanager", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-communitymanager").slideDown();
  }
  else {
    $("#query-attributes-communitymanager").slideUp();
  }
});


$(document).delegate("#query-type-moderator", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-moderator").slideDown();
  }
  else {
    $("#query-attributes-moderator").slideUp();
  }
});


$(document).delegate("#query-type-viewer", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-viewer").slideDown();
  }
  else {
    $("#query-attributes-viewer").slideUp();
  }
});


$(document).delegate("#query-type-other", "change", function() {
  if ($(this).is(":checked") === true) {
    $("#query-attributes-other").slideDown();
  }
  else {
    $("#query-attributes-other").slideUp();
  }
});

$(document).delegate("#query-submit", "click", function() {
  var types = {},
      attributes = {},
      tags = {},
      public_query = $("#query-public").is(":checked"),
      description = $("#query-description").val();

  if (public_query && !description) {
    Materialize.toast('You must enter a query description.', 4000, 'rounded');
    return;
  }

  types.streamer_gaming = $("#query-type-streamer-gaming").is(":checked");
  types.streamer_creative = $("#query-type-streamer-creative").is(":checked");
  types.streamer_irl = $("#query-type-streamer-irl").is(":checked");
  types.streamer_socialeating = $("#query-type-streamer-socialeating").is(":checked");
  types.streamer_talkshow = $("#query-type-streamer-talkshow").is(":checked");
  types.streamer_music = $("#query-type-streamer-music").is(":checked");
  types.artist = $("#query-type-artist").is(":checked");
  types.developer = $("#query-type-developer").is(":checked");
  types.communitymanager = $("#query-type-communitymanager").is(":checked");
  types.moderator = $("#query-type-moderator").is(":checked");
  types.viewer = $("#query-type-viewer").is(":checked");
  types.other = $("#query-type-other").is(":checked");

  if (!types.streamer_gaming && !types.streamer_creative && !types.streamer_irl && !types.streamer_socialeating && !types.streamer_talkshow && !types.streamer_music && !types.artist && !types.developer && !types.communitymanager && !types.moderator && !types.viewer && !types.other) {
    Materialize.toast('You must select at least one profile type.', 4000, 'rounded');
    return;
  }

  if ($("#query-type-one").is(":checked") === true) {
    types.method = "one";
  }
  else {
    types.method = "all";
  }

  attributes.overview = {};
  attributes.overview.keywords = [];
  for (var tag of $("#query-attributes-overview-keywords").material_chip('data')) {
    attributes.overview.keywords.push(tag.tag);
  }

  if ($("#query-type-streamer-gaming").is(":checked") === true) {
    attributes.streamer_gaming = {};
    attributes.streamer_gaming.genres = {};

    if ($("#query-attributes-streamer-gaming-action").is(":checked") === true) {
      attributes.streamer_gaming.genres.action = true;
    }
    else {
      attributes.streamer_gaming.genres.action = false;
    }
    if ($("#query-attributes-streamer-gaming-adventure").is(":checked") === true) {
      attributes.streamer_gaming.genres.adventure = true;
    }
    else {
      attributes.streamer_gaming.genres.adventure = false;
    }
    if ($("#query-attributes-streamer-gaming-horror").is(":checked") === true) {
      attributes.streamer_gaming.genres.horror = true;
    }
    else {
      attributes.streamer_gaming.genres.horror = false;
    }
    if ($("#query-attributes-streamer-gaming-roleplaying").is(":checked") === true) {
      attributes.streamer_gaming.genres.roleplaying = true;
    }
    else {
      attributes.streamer_gaming.genres.roleplaying = false;
    }
    if ($("#query-attributes-streamer-gaming-simulation").is(":checked") === true) {
      attributes.streamer_gaming.genres.simulation = true;
    }
    else {
      attributes.streamer_gaming.genres.simulation = false;
    }
    if ($("#query-attributes-streamer-gaming-strategy").is(":checked") === true) {
      attributes.streamer_gaming.genres.strategy = true;
    }
    else {
      attributes.streamer_gaming.genres.strategy = false;
    }
    if ($("#query-attributes-streamer-gaming-survival").is(":checked") === true) {
      attributes.streamer_gaming.genres.survival = true;
    }
    else {
      attributes.streamer_gaming.genres.survival = false;
    }
    if ($("#query-attributes-streamer-gaming-other").is(":checked") === true) {
      attributes.streamer_gaming.genres.other = true;
    }
    else {
      attributes.streamer_gaming.genres.other = false;
    }

    if ($("#query-attributes-streamer-gaming-one").is(":checked") === true) {
      attributes.streamer_gaming.genres.method = "one";
    }
    else {
      attributes.streamer_gaming.genres.method = "all";
    }

    if ($("#query-streamer-gaming-collaborating-yes").is(":checked") === true) {
      attributes.streamer_gaming.collaborating = "yes";
    }
    else if ($("#query-streamer-gaming-collaborating-no").is(":checked") === true) {
      attributes.streamer_gaming.collaborating = "no";
    }
    else {
      attributes.streamer_gaming.collaborating = "any";
    }
    if ($("#query-streamer-gaming-charity-yes").is(":checked") === true) {
      attributes.streamer_gaming.charity = "yes";
    }
    else if ($("#query-streamer-gaming-charity-no").is(":checked") === true) {
      attributes.streamer_gaming.charity = "no";
    }
    else {
      attributes.streamer_gaming.charity = "any";
    }

    attributes.streamer_gaming.keywords = [];
    for (var tag of $("#query-attributes-streamer-gaming-keywords").material_chip('data')) {
      attributes.streamer_gaming.keywords.push(tag.tag);
    }

    if ($("#query-attributes-streamer-gaming-action").is(":checked") === false && $("#query-attributes-streamer-gaming-adventure").is(":checked") === false && $("#query-attributes-streamer-gaming-horror").is(":checked") === false && $("#query-attributes-streamer-gaming-roleplaying").is(":checked") === false && $("#query-attributes-streamer-gaming-simulation").is(":checked") === false && $("#query-attributes-streamer-gaming-strategy").is(":checked") === false && $("#query-attributes-streamer-gaming-survival").is(":checked") === false && $("#query-attributes-streamer-gaming-other").is(":checked") === false) {
      Materialize.toast('You must select at least one game genre.', 4000, 'rounded');
      return;
    }
  }

  if ($("#query-type-streamer-creative").is(":checked") === true) {
    attributes.streamer_creative = {};
    attributes.streamer_creative.activities = {};

    if ($("#query-attributes-streamer-creative-cooking").is(":checked") === true) {
      attributes.streamer_creative.activities.cooking = true;
    }
    else {
      attributes.streamer_creative.activities.cooking = false;
    }
    if ($("#query-attributes-streamer-creative-drawing").is(":checked") === true) {
      attributes.streamer_creative.activities.drawing = true;
    }
    else {
      attributes.streamer_creative.activities.drawing = false;
    }
    if ($("#query-attributes-streamer-creative-painting").is(":checked") === true) {
      attributes.streamer_creative.activities.painting = true;
    }
    else {
      attributes.streamer_creative.activities.painting = false;
    }
    if ($("#query-attributes-streamer-creative-programming").is(":checked") === true) {
      attributes.streamer_creative.activities.programming = true;
    }
    else {
      attributes.streamer_creative.activities.programming = false;
    }
    if ($("#query-attributes-streamer-creative-editing").is(":checked") === true) {
      attributes.streamer_creative.activities.editing = true;
    }
    else {
      attributes.streamer_creative.activities.editing = false;
    }
    if ($("#query-attributes-streamer-creative-other").is(":checked") === true) {
      attributes.streamer_creative.activities.other = true;
    }
    else {
      attributes.streamer_creative.activities.other = false;
    }

    if ($("#query-attributes-streamer-creative-one").is(":checked") === true) {
      attributes.streamer_creative.activities.method = "one";
    }
    else {
      attributes.streamer_creative.activities.method = "all";
    }

    if ($("#query-streamer-creative-collaborating-yes").is(":checked") === true) {
      attributes.streamer_creative.collaborating = "yes";
    }
    else if ($("#query-streamer-creative-collaborating-no").is(":checked") === true) {
      attributes.streamer_creative.collaborating = "no";
    }
    else {
      attributes.streamer_creative.collaborating = "any";
    }
    if ($("#query-streamer-creative-charity-yes").is(":checked") === true) {
      attributes.streamer_creative.charity = "yes";
    }
    else if ($("#query-streamer-creative-charity-no").is(":checked") === true) {
      attributes.streamer_creative.charity = "no";
    }
    else {
      attributes.streamer_creative.charity = "any";
    }

    attributes.streamer_creative.keywords = [];
    for (var tag of $("#query-attributes-streamer-creative-keywords").material_chip('data')) {
      attributes.streamer_creative.keywords.push(tag.tag);
    }

    if ($("#query-attributes-streamer-creative-cooking").is(":checked") === false && $("#query-attributes-streamer-creative-drawing").is(":checked") === false && $("#query-attributes-streamer-creative-painting").is(":checked") === false && $("#query-attributes-streamer-creative-programming").is(":checked") === false && $("#query-attributes-streamer-creative-editing").is(":checked") === false) {
      Materialize.toast('You must select at least one creative activity.', 4000, 'rounded');
      return;
    }
  }

  attributes.streamer_irl = {};
  if ($("#query-streamer-irl-collaborating-yes").is(":checked") === true) {
    attributes.streamer_irl.collaborating = "yes";
  }
  else if ($("#query-streamer-irl-collaborating-no").is(":checked") === true) {
    attributes.streamer_irl.collaborating = "no";
  }
  else {
    attributes.streamer_irl.collaborating = "any";
  }
  if ($("#query-streamer-irl-charity-yes").is(":checked") === true) {
    attributes.streamer_irl.charity = "yes";
  }
  else if ($("#query-streamer-irl-charity-no").is(":checked") === true) {
    attributes.streamer_irl.charity = "no";
  }
  else {
    attributes.streamer_irl.charity = "any";
  }

  if ($("#query-type-streamer-irl").is(":checked") === true) {
    attributes.streamer_irl.keywords = [];
    for (var tag of $("#query-attributes-streamer-irl-keywords").material_chip('data')) {
      attributes.streamer_irl.keywords.push(tag.tag);
    }
  }

  attributes.streamer_socialeating = {};
  if ($("#query-streamer-socialeating-collaborating-yes").is(":checked") === true) {
    attributes.streamer_socialeating.collaborating = "yes";
  }
  else if ($("#query-streamer-socialeating-collaborating-no").is(":checked") === true) {
    attributes.streamer_socialeating.collaborating = "no";
  }
  else {
    attributes.streamer_socialeating.collaborating = "any";
  }
  if ($("#query-streamer-socialeating-charity-yes").is(":checked") === true) {
    attributes.streamer_socialeating.charity = "yes";
  }
  else if ($("#query-streamer-socialeating-charity-no").is(":checked") === true) {
    attributes.streamer_socialeating.charity = "no";
  }
  else {
    attributes.streamer_socialeating.charity = "any";
  }

  if ($("#query-type-streamer-socialeating").is(":checked") === true) {
    attributes.streamer_socialeating.keywords = [];
    for (var tag of $("#query-attributes-streamer-socialeating-keywords").material_chip('data')) {
      attributes.streamer_socialeating.keywords.push(tag.tag);
    }
  }

  attributes.streamer_talkshow = {};
  if ($("#query-streamer-talkshow-collaborating-yes").is(":checked") === true) {
    attributes.streamer_talkshow.collaborating = "yes";
  }
  else if ($("#query-streamer-talkshow-collaborating-no").is(":checked") === true) {
    attributes.streamer_talkshow.collaborating = "no";
  }
  else {
    attributes.streamer_talkshow.collaborating = "any";
  }
  if ($("#query-streamer-talkshow-charity-yes").is(":checked") === true) {
    attributes.streamer_talkshow.charity = "yes";
  }
  else if ($("#query-streamer-talkshow-charity-no").is(":checked") === true) {
    attributes.streamer_talkshow.charity = "no";
  }
  else {
    attributes.streamer_talkshow.charity = "any";
  }

  if ($("#query-type-streamer-talkshow").is(":checked") === true) {
    attributes.streamer_talkshow.keywords = [];
    for (var tag of $("#query-attributes-streamer-talkshow-keywords").material_chip('data')) {
      attributes.streamer_talkshow.keywords.push(tag.tag);
    }
  }

  attributes.streamer_music = {};
  if ($("#query-streamer-music-collaborating-yes").is(":checked") === true) {
    attributes.streamer_music.collaborating = "yes";
  }
  else if ($("#query-streamer-music-collaborating-no").is(":checked") === true) {
    attributes.streamer_music.collaborating = "no";
  }
  else {
    attributes.streamer_music.collaborating = "any";
  }
  if ($("#query-streamer-music-charity-yes").is(":checked") === true) {
    attributes.streamer_music.charity = "yes";
  }
  else if ($("#query-streamer-music-charity-no").is(":checked") === true) {
    attributes.streamer_music.charity = "no";
  }
  else {
    attributes.streamer_music.charity = "any";
  }

  if ($("#query-type-streamer-music").is(":checked") === true) {
    attributes.streamer_music.keywords = [];
    for (var tag of $("#query-attributes-streamer-music-keywords").material_chip('data')) {
      attributes.streamer_music.keywords.push(tag.tag);
    }
  }

  if ($("#query-type-artist").is(":checked") === true) {
    attributes.artist = {};
    if ($("#query-artist-commissions-accepts-yes").is(":checked") === true) {
      attributes.artist.accepts = "yes";
    }
    else if ($("#query-artist-commissions-accepts-no").is(":checked") === true) {
      attributes.artist.accepts = "no";
    }
    else {
      attributes.artist.accepts = "any";
    }
    if ($("#query-artist-commissions-charges-yes").is(":checked") === true) {
      attributes.artist.charges = "yes";
    }
    else if ($("#query-artist-commissions-charges-no").is(":checked") === true) {
      attributes.artist.charges = "no";
    }
    else {
      attributes.artist.charges = "any";
    }
    if ($("#query-artist-commissions-currently-yes").is(":checked") === true) {
      attributes.artist.currently = "yes";
    }
    else if ($("#query-artist-commissions-currently-no").is(":checked") === true) {
      attributes.artist.currently = "no";
    }
    else {
      attributes.artist.currently = "any";
    }

    attributes.artist.keywords = [];
    for (var tag of $("#query-attributes-artist-keywords").material_chip('data')) {
      attributes.artist.keywords.push(tag.tag);
    }
  }

  if ($("#query-type-developer").is(":checked") === true) {
    attributes.developer = {};
    if ($("#query-developer-commissions-accepts-yes").is(":checked") === true) {
      attributes.developer.accepts = "yes";
    }
    else if ($("#query-developer-commissions-accepts-no").is(":checked") === true) {
      attributes.developer.accepts = "no";
    }
    else {
      attributes.developer.accepts = "any";
    }
    if ($("#query-developer-commissions-charges-yes").is(":checked") === true) {
      attributes.developer.charges = "yes";
    }
    else if ($("#query-developer-commissions-charges-no").is(":checked") === true) {
      attributes.developer.charges = "no";
    }
    else {
      attributes.developer.charges = "any";
    }
    if ($("#query-developer-commissions-currently-yes").is(":checked") === true) {
      attributes.developer.currently = "yes";
    }
    else if ($("#query-developer-commissions-currently-no").is(":checked") === true) {
      attributes.developer.currently = "no";
    }
    else {
      attributes.developer.currently = "any";
    }

    attributes.developer.keywords = [];
    for (var tag of $("#query-attributes-developer-keywords").material_chip('data')) {
      attributes.developer.keywords.push(tag.tag);
    }
  }

  if ($("#query-type-communitymanager").is(":checked") === true) {
    attributes.communitymanager = {};
    attributes.communitymanager.keywords = [];
    for (var tag of $("#query-attributes-communitymanager-keywords").material_chip('data')) {
      attributes.communitymanager.keywords.push(tag.tag);
    }
  }

  if ($("#query-type-moderator").is(":checked") === true) {
    attributes.moderator = {};
    if ($("#query-moderator-requests-accepts-yes").is(":checked") === true) {
      attributes.moderator.accepts = "yes";
    }
    else if ($("#query-moderator-requests-accepts-no").is(":checked") === true) {
      attributes.moderator.accepts = "no";
    }
    else {
      attributes.moderator.accepts = "any";
    }

    attributes.moderator.keywords = [];
    for (var tag of $("#query-attributes-moderator-keywords").material_chip('data')) {
      attributes.moderator.keywords.push(tag.tag);
    }
  }

  if ($("#query-type-viewer").is(":checked") === true) {
    attributes.viewer = {};
    attributes.viewer.preferences = {};

    if ($("#query-attributes-viewer-streams-action").is(":checked") === true) {
      attributes.viewer.preferences.action = true;
    }
    else {
      attributes.viewer.preferences.action = false;
    }
    if ($("#query-attributes-viewer-streams-adventure").is(":checked") === true) {
      attributes.viewer.preferences.adventure = true;
    }
    else {
      attributes.viewer.preferences.adventure = false;
    }
    if ($("#query-attributes-viewer-streams-roleplaying").is(":checked") === true) {
      attributes.viewer.preferences.roleplaying = true;
    }
    else {
      attributes.viewer.preferences.roleplaying = false;
    }
    if ($("#query-attributes-viewer-streams-simulation").is(":checked") === true) {
      attributes.viewer.preferences.simulation = true;
    }
    else {
      attributes.viewer.preferences.simulation = false;
    }
    if ($("#query-attributes-viewer-streams-horror").is(":checked") === true) {
      attributes.viewer.preferences.horror = true;
    }
    else {
      attributes.viewer.preferences.horror = false;
    }
    if ($("#query-attributes-viewer-streams-strategy").is(":checked") === true) {
      attributes.viewer.preferences.strategy = true;
    }
    else {
      attributes.viewer.preferences.strategy = false;
    }
    if ($("#query-attributes-viewer-streams-survival").is(":checked") === true) {
      attributes.viewer.preferences.survival = true;
    }
    else {
      attributes.viewer.preferences.survival = false;
    }
    if ($("#query-attributes-viewer-streams-cooking").is(":checked") === true) {
      attributes.viewer.preferences.cooking = true;
    }
    else {
      attributes.viewer.preferences.cooking = false;
    }
    if ($("#query-attributes-viewer-streams-drawing").is(":checked") === true) {
      attributes.viewer.preferences.drawing = true;
    }
    else {
      attributes.viewer.preferences.drawing = false;
    }
    if ($("#query-attributes-viewer-streams-painting").is(":checked") === true) {
      attributes.viewer.preferences.painting = true;
    }
    else {
      attributes.viewer.preferences.painting = false;
    }
    if ($("#query-attributes-viewer-streams-programming").is(":checked") === true) {
      attributes.viewer.preferences.programming = true;
    }
    else {
      attributes.viewer.preferences.programming = false;
    }
    if ($("#query-attributes-viewer-streams-editing").is(":checked") === true) {
      attributes.viewer.preferences.editing = true;
    }
    else {
      attributes.viewer.preferences.editing = false;
    }
    if ($("#query-attributes-viewer-streams-irl").is(":checked") === true) {
      attributes.viewer.preferences.irl = true;
    }
    else {
      attributes.viewer.preferences.irl = false;
    }
    if ($("#query-attributes-viewer-streams-talkshow").is(":checked") === true) {
      attributes.viewer.preferences.talkshow = true;
    }
    else {
      attributes.viewer.preferences.talkshow = false;
    }
    if ($("#query-attributes-viewer-streams-socialeating").is(":checked") === true) {
      attributes.viewer.preferences.socialeating = true;
    }
    else {
      attributes.viewer.preferences.socialeating = false;
    }
    if ($("#query-attributes-viewer-streams-music").is(":checked") === true) {
      attributes.viewer.preferences.music = true;
    }
    else {
      attributes.viewer.preferences.music = false;
    }

    if ($("#query-attributes-viewer-one").is(":checked") === true) {
      attributes.viewer.preferences.method = "one";
    }
    else {
      attributes.viewer.preferences.method = "all";
    }

    if ($("#query-attributes-viewer-family").is(":checked") === true) {
      attributes.viewer.family = true;
    }
    else {
      attributes.viewer.family = false;
    }

    attributes.viewer.keywords = [];
    for (var tag of $("#query-attributes-viewer-keywords").material_chip('data')) {
      attributes.viewer.keywords.push(tag.tag);
    }

    if ($("#query-attributes-viewer-streams-action").is(":checked") === false && $("#query-attributes-viewer-streams-adventure").is(":checked") === false && $("#query-attributes-viewer-streams-roleplaying").is(":checked") === false && $("#query-attributes-viewer-streams-simulation").is(":checked") === false && $("#query-attributes-viewer-streams-horror").is(":checked") === false && $("#query-attributes-viewer-streams-strategy").is(":checked") === false && $("#query-attributes-viewer-streams-survival").is(":checked") === false && $("#query-attributes-viewer-streams-cooking").is(":checked") === false && $("#query-attributes-viewer-streams-drawing").is(":checked") === false && $("#query-attributes-viewer-streams-painting").is(":checked") === false && $("#query-attributes-viewer-streams-programming").is(":checked") === false && $("#query-attributes-viewer-streams-editing").is(":checked") === false && $("#query-attributes-viewer-streams-irl").is(":checked") === false && $("#query-attributes-viewer-streams-talkshow").is(":checked") === false && $("#query-attributes-viewer-streams-socialeating").is(":checked") === false && $("#query-attributes-viewer-streams-music").is(":checked") === false) {
      Materialize.toast('You must select at least one viewer preference.', 4000, 'rounded');
      return;
    }
  }

  if ($("#query-type-other").is(":checked") === true) {
    attributes.other = {};
    attributes.other.keywords = [];
    for (var tag of $("#query-attributes-other-keywords").material_chip('data')) {
      attributes.other.keywords.push(tag.tag);
    }
  }

  tags.tags = [];
  for (var tag of $("#query-tags").material_chip('data')) {
    tags.tags.push(tag.tag)
  }

  if ($("#query-tags-one").is(":checked") === true) {
    tags.method = "one";
  }
  else {
    tags.method = "all";
  }

  $.post("/browse/query/submit", {
    types: types,
    attributes: attributes,
    tags: tags,
    public: public_query,
    description: description
  }, function(data) {
    if (data.message == "success") {
      window.location.replace("/browse/query/result");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});
