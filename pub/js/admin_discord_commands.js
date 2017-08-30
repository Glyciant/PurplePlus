$(document).delegate("#edit-command-restrict", "change", function() {
  if ($(this).is(":checked")) {
    $("#edit-command-method-one").prop("disabled", false);
    $("#edit-command-method-all").prop("disabled", false);
    $("#edit-command-allow-mods").prop("disabled", false);
    $("#edit-command-allow-helpers").prop("disabled", false);
    $("#edit-command-allow-wiki").prop("disabled", false);
    $("#edit-command-allow-staff").prop("disabled", false);
    $("#edit-command-allow-admins").prop("disabled", false);
    $("#edit-command-allow-global-mods").prop("disabled", false);
    $("#edit-command-allow-contributors").prop("disabled", false);
    $("#edit-command-allow-profiles").prop("disabled", false);
    $("#edit-command-allow-twoos").prop("disabled", false);
    $("#edit-command-allow-twoos-value").prop("value", "");
    $("#edit-command-method-one").prop("checked", true);
    $("#edit-command-method-all").prop("checked", false);
    $("#edit-command-allow-mods").prop("checked", true);
    $("#edit-command-allow-helpers").prop("checked", true);
  }
  else {
    $("#edit-command-method-one").prop("disabled", true);
    $("#edit-command-method-all").prop("disabled", true);
    $("#edit-command-allow-mods").prop("disabled", true);
    $("#edit-command-allow-helpers").prop("disabled", true);
    $("#edit-command-allow-wiki").prop("disabled", true);
    $("#edit-command-allow-staff").prop("disabled", true);
    $("#edit-command-allow-admins").prop("disabled", true);
    $("#edit-command-allow-global-mods").prop("disabled", true);
    $("#edit-command-allow-contributors").prop("disabled", true);
    $("#edit-command-allow-profiles").prop("disabled", true);
    $("#edit-command-allow-twoos").prop("disabled", true);
    $("#edit-command-allow-twoos-value").prop("disabled", true);
    $("#edit-command-allow-twoos-value").prop("value", "");
    $("#edit-command-method-one").prop("checked", true);
    $("#edit-command-method-all").prop("checked", false);
    $("#edit-command-allow-mods").prop("checked", false);
    $("#edit-command-allow-helpers").prop("checked", false);
    $("#edit-command-allow-wiki").prop("checked", false);
    $("#edit-command-allow-staff").prop("checked", false);
    $("#edit-command-allow-admins").prop("checked", false);
    $("#edit-command-allow-global-mods").prop("checked", false);
    $("#edit-command-allow-contributors").prop("checked", false);
    $("#edit-command-allow-profiles").prop("checked", false);
    $("#edit-command-allow-twoos").prop("checked", false);
  }
});

$(document).delegate("#edit-command-allow-twoos", "change", function() {
  if ($(this).is(":checked")) {
    $("#edit-command-allow-twoos-value").prop("disabled", false);
    $("#edit-command-allow-twoos-value").prop("value", "");
  }
  else {
    $("#edit-command-allow-twoos-value").prop("disabled", true);
    $("#edit-command-allow-twoos-value").prop("value", "");
  }
});

$(document).delegate("#add-command", "click", function() {
  $("#command-modal-title").html("Add Discord Command");
  $("#save-command").data("id", "");
  $("#edit-command-method-one").prop("disabled", true);
  $("#edit-command-method-all").prop("disabled", true);
  $("#edit-command-allow-mods").prop("disabled", true);
  $("#edit-command-allow-helpers").prop("disabled", true);
  $("#edit-command-allow-wiki").prop("disabled", true);
  $("#edit-command-allow-staff").prop("disabled", true);
  $("#edit-command-allow-admins").prop("disabled", true);
  $("#edit-command-allow-global-mods").prop("disabled", true);
  $("#edit-command-allow-contributors").prop("disabled", true);
  $("#edit-command-allow-profiles").prop("disabled", true);
  $("#edit-command-allow-twoos").prop("disabled", true);
  $("#edit-command-allow-twoos-value").prop("disabled", true);
  $("#edit-command-allow-twoos-value").prop("value", "");
  $("#edit-command-trigger").prop("value", "");
  $("#edit-command-response").prop("value", "");
  $("#edit-command-enabled").prop("checked", true);
  $("#edit-command-method-one").prop("checked", true);
  $("#edit-command-method-all").prop("checked", false);
  $("#edit-command-allow-mods").prop("checked", false);
  $("#edit-command-allow-helpers").prop("checked", false);
  $("#edit-command-allow-wiki").prop("checked", false);
  $("#edit-command-allow-staff").prop("checked", false);
  $("#edit-command-allow-admins").prop("checked", false);
  $("#edit-command-allow-global-mods").prop("checked", false);
  $("#edit-command-allow-contributors").prop("checked", false);
  $("#edit-command-allow-profiles").prop("checked", false);
  $("#edit-command-allow-twoos").prop("checked", false);
});

$(document).delegate("#edit-command", "click", function() {
  var id = $(this).data("id");
  $("#command-modal-title").html("Edit Discord Command");
  $("#save-command").data("id", id);
  $.post("/admin/discord/commands/get", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#edit-command-trigger").val(data.data.name);
      $("#edit-command-response").val(data.data.response);
      $("#edit-command-enabled").prop("checked", (data.data.enabled === true));
      $("#edit-command-restrict").prop("checked", (data.data.restricted === true));
      if (data.data.restricted === true) {
        $("#edit-command-method-one").prop("disabled", false);
        $("#edit-command-method-all").prop("disabled", false);
        $("#edit-command-allow-mods").prop("disabled", false);
        $("#edit-command-allow-helpers").prop("disabled", false);
        $("#edit-command-allow-wiki").prop("disabled", false);
        $("#edit-command-allow-staff").prop("disabled", false);
        $("#edit-command-allow-admins").prop("disabled", false);
        $("#edit-command-allow-global-mods").prop("disabled", false);
        $("#edit-command-allow-contributors").prop("disabled", false);
        $("#edit-command-allow-profiles").prop("disabled", false);
        $("#edit-command-allow-twoos").prop("disabled", false);
        $("#edit-command-method-one").prop("checked", (data.data.restrictions.method == "one"));
        $("#edit-command-method-all").prop("checked", (data.data.restrictions.method == "all"));
        $("#edit-command-allow-mods").prop("checked", data.data.restrictions.mods);
        $("#edit-command-allow-helpers").prop("checked", data.data.restrictions.helpers);
        $("#edit-command-allow-wiki").prop("checked", data.data.restrictions.wiki);
        $("#edit-command-allow-staff").prop("checked", data.data.restrictions.staff);
        $("#edit-command-allow-admins").prop("checked", data.data.restrictions.admins);
        $("#edit-command-allow-global-mods").prop("checked", data.data.restrictions.global_mods);
        $("#edit-command-allow-contributors").prop("checked", data.data.restrictions.contributors);
        $("#edit-command-allow-profiles").prop("checked", data.data.restrictions.profiles);
        $("#edit-command-allow-twoos").prop("checked", data.data.restrictions.twoos);
        if (data.data.restrictions.twoos === true) {
          $("#edit-command-allow-twoos-value").prop("disabled", false);
          $("#edit-command-allow-twoos-value").prop("value", data.data.restrictions.twoos_value);
        }
        else {
          $("#edit-command-allow-twoos-value").prop("disabled", true);
          $("#edit-command-allow-twoos-value").prop("value", "");
        }
      }
      else {
        $("#edit-command-method-one").prop("disabled", true);
        $("#edit-command-method-all").prop("disabled", true);
        $("#edit-command-allow-mods").prop("disabled", true);
        $("#edit-command-allow-helpers").prop("disabled", true);
        $("#edit-command-allow-wiki").prop("disabled", true);
        $("#edit-command-allow-staff").prop("disabled", true);
        $("#edit-command-allow-admins").prop("disabled", true);
        $("#edit-command-allow-global-mods").prop("disabled", true);
        $("#edit-command-allow-contributors").prop("disabled", true);
        $("#edit-command-allow-profiles").prop("disabled", true);
        $("#edit-command-allow-twoos").prop("disabled", true);
        $("#edit-command-allow-twoos-value").prop("disabled", true);
        $("#edit-command-allow-twoos-value").prop("value", "");
        $("#edit-command-method-one").prop("checked", true);
        $("#edit-command-method-all").prop("checked", false);
        $("#edit-command-allow-mods").prop("checked", false);
        $("#edit-command-allow-helpers").prop("checked", false);
        $("#edit-command-allow-wiki").prop("checked", false);
        $("#edit-command-allow-staff").prop("checked", false);
        $("#edit-command-allow-admins").prop("checked", false);
        $("#edit-command-allow-global-mods").prop("checked", false);
        $("#edit-command-allow-contributors").prop("checked", false);
        $("#edit-command-allow-profiles").prop("checked", false);
        $("#edit-command-allow-twoos").prop("checked", false);
      }
      Materialize.updateTextFields();
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#delete-command", "click", function() {
  var id = $(this).data("id");
  $.post("/admin/discord/commands/delete", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      location.reload();
    }
    else if (data.message == "forbidden") {
      Materialize.toast("You do not have permission to do that.", 4000, "rounded");
    }
    else {
      Materialize.toast("An unknown error occurred.", 4000, "rounded");
    }
  });
});

$(document).delegate("#save-command", "click", function() {
  var id = $(this).data("id"),
      name = $("#edit-command-trigger").val(),
      response = $("#edit-command-response").val(),
      enabled = $("#edit-command-enabled").is(":checked"),
      restricted = $("#edit-command-restrict").is(":checked"),
      restrictions = {};

  if (restricted === true) {
    if ($("#edit-command-method-all").prop("checked")) {
      restrictions.method = "all";
    }
    else {
      restrictions.method = "one";
    }
    restrictions.mods = $("#edit-command-allow-mods").prop("checked");
    restrictions.helpers = $("#edit-command-allow-helpers").prop("checked");
    restrictions.wiki = $("#edit-command-allow-wiki").prop("checked");
    restrictions.staff = $("#edit-command-allow-staff").prop("checked");
    restrictions.admins = $("#edit-command-allow-admins").prop("checked");
    restrictions.global_mods = $("#edit-command-allow-global-mods").prop("checked");
    restrictions.contributors = $("#edit-command-allow-contributors").prop("checked");
    restrictions.profiles = $("#edit-command-allow-profiles").prop("checked");
    restrictions.twoos = $("#edit-command-allow-twoos").prop("checked");
    if (restrictions.twoos === true) {
      restrictions.twoos_value = $("#edit-command-allow-twoos-value").val();
    }
  }

  if (!name || !response || (restrictions.twoos === true && restrictions.twoos_value < 0) || (restrictions.twoos === true && !restrictions.twoos_value)) {
    if (!name) {
      $("#edit-command-trigger").addClass("invalid");
    }
    if (!response) {
      $("#edit-command-response").addClass("invalid");
    }
    if ((restrictions.twoos === true && restrictions.twoos_value < 0) || (restrictions.twoos === true && !restrictions.twoos_value)) {
      $("#edit-command-allow-twoos-value").addClass("invalid");
    }
    setTimeout(function() {
      $("#edit-command-trigger").removeClass("invalid");
      $("#edit-command-response").removeClass("invalid");
      $("#edit-command-allow-twoos-value").removeClass("invalid");
    }, 3000);
    Materialize.toast("You have not filled out all fields correctly.", 4000, "rounded");
  }
  else {
    if (id) {
      $.post("/admin/discord/commands/edit", {
        id: id,
        name: name,
        response: response,
        enabled: enabled,
        restricted: restricted,
        restrictions: restrictions
      }, function(data) {
        if (data.message == "success") {
          location.reload();
        }
        else if (data.message == "exists") {
          Materialize.toast("A command with that name already exists.", 4000, "rounded");
        }
        else if (data.message == "forbidden") {
          Materialize.toast("You do not have permission to do that.", 4000, "rounded");
        }
        else {
          Materialize.toast("An unknown error occurred.", 4000, "rounded");
        }
      });
    }
    else {
      $.post("/admin/discord/commands/add", {
        name: name,
        response: response,
        enabled: enabled,
        restricted: restricted,
        restrictions: restrictions
      }, function(data) {
        if (data.message == "success") {
          location.reload();
        }
        else if (data.message == "exists") {
          Materialize.toast("A command with that name already exists.", 4000, "rounded");
        }
        else if (data.message == "forbidden") {
          Materialize.toast("You do not have permission to do that.", 4000, "rounded");
        }
        else {
          Materialize.toast("An unknown error occurred.", 4000, "rounded");
        }
      });
    }
  }
});
