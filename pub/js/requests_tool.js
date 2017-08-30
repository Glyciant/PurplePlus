$(document).delegate("#tool-api", "change", function() {
  if ($("#tool-api").is(":checked")) {
    $("#tool-api-child").slideDown();
  }
  else {
    $("#tool-api-child").slideUp();
  }
});

$(document).delegate("#tool-tos", "change", function() {
  if ($("#tool-tos").is(":checked")) {
    $("#tool-tos-child").slideDown();
  }
  else {
    $("#tool-tos-child").slideUp();
  }
});

$(document).delegate("#tool-source", "change", function() {
  if ($("#tool-source").is(":checked")) {
    $("#tool-source-child").slideDown();
  }
  else {
    $("#tool-source-child").slideUp();
  }
});

$(document).delegate("#tool-beta", "change", function() {
  if ($("#tool-beta").is(":checked")) {
    $("#tool-beta-child").slideDown();
  }
  else {
    $("#tool-beta-child").slideUp();
  }
});

$(document).delegate("#submit-request", "click", function() {
    var reddit = $(this).data("reddit"),
        twitch = $(this).data("twitch"),
        type = $(this).data("type"),
        data = {
          name: $("#tool-name").val(),
          url: $("#tool-url").val(),
          description: $("#tool-description").val(),
          data: $("#tool-data").val(),
          api: $("#tool-api").is(":checked"),
          tos: $("#tool-tos").is(":checked"),
          source: $("#tool-source").is(":checked"),
          beta: $("#tool-beta").is(":checked")
        },
    missing = false;

    if (!data.name || !data.url || !data.description || !data.data) {
      if (!data.name) {
        $("#tool-name").addClass("invalid");
      }
      if (!data.url) {
        $("#tool-url").addClass("invalid");
      }
      if (!data.description) {
        $("#tool-description").addClass("invalid");
      }
      if (!data.data) {
        $("#tool-data").addClass("invalid");
      }
      missing = true;
    }
    if (data.api === true) {
      data.api_data = {
        store: $("#tool-api-store").val(),
        scopes: $("#tool-api-scopes").val(),
        scopes_description: $("#tool-api-scopes-description").val()
      }
      if (!data.api_data.store || !data.api_data.scopes || !data.api_data.scopes_description) {
        if (!data.api_data.store) {
          $("#tool-api-store").addClass("invalid");
        }
        if (!data.api_data.scopes) {
          $("#tool-api-scopes").addClass("invalid");
        }
        if (!data.api_data.scopes_description) {
          $("#tool-api-scopes-description").addClass("invalid");
        }
        missing = true;
      }
    }

    if (data.tos === true) {
      data.tos_url = $("#tool-tos-link").val();
      if (!data.tos_url) {
        $("#tool-tos-link").addClass("invalid");
        missing = true;
      }
    }

    if (data.source === true) {
      data.source_url = $("#tool-source-link").val();
      if (!data.source_url) {
        $("#tool-source-link").addClass("invalid");
        missing = true;
      }
    }

    if (data.beta === true) {
      data.beta_changes = $("#tool-beta-description").val();
      if (!data.beta_changes) {
        $("#tool-beta-description").addClass("invalid");
        missing = true;
      }
    }

    if (type == "extension") {
      data.browsers = {
        edge: $("#tool-browser-edge").is(":checked"),
        explorer: $("#tool-browser-explorer").is(":checked"),
        chrome: $("#tool-browser-chrome").is(":checked"),
        firefox: $("#tool-browser-firefox").is(":checked"),
        opera: $("#tool-browser-opera").is(":checked"),
        safari: $("#tool-browser-safari").is(":checked")
      };
    }

    if (missing) {
      setTimeout(function() {
        $("#tool-name").removeClass("invalid");
        $("#tool-url").removeClass("invalid");
        $("#tool-description").removeClass("invalid");
        $("#tool-data").removeClass("invalid");
        $("#tool-api-store").removeClass("invalid");
        $("#tool-api-scopes").removeClass("invalid");
        $("#tool-api-scopes-description").removeClass("invalid");
        $("#tool-tos-link").removeClass("invalid");
        $("#tool-source-link").removeClass("invalid");
        $("#tool-beta-description").removeClass("invalid");
      }, 3000);
      Materialize.toast('You have not completed a field.', 4000, 'rounded');
    }
    else {
      $.post("/requests/submit", {
        reddit: reddit,
        twitch: twitch,
        type: type,
        data: data
      }, function(data) {
        if (data.message == "success") {
          window.location = data.redirect;
        }
        else if (data.message == "forbidden") {
          Materialize.toast('You do not have permission to do that.', 4000, 'rounded');
        }
        else {
          Materialize.toast('An unknown error occurred.', 4000, 'rounded');
        }
      });
    }
});
