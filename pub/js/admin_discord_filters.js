$(document).delegate("#edit-filter-exclude-twoos", "change", function() {
  if ($(this).is(":checked")) {
    $("#edit-filter-exclude-twoos-value").prop("disabled", false);
    $("#edit-filter-exclude-twoos-value").prop("value", "");
  }
  else {
    $("#edit-filter-exclude-twoos-value").prop("disabled", true);
    $("#edit-filter-exclude-twoos-value").prop("value", "");
  }
});

$(document).delegate("#add-filter", "click", function() {
  $("#filter-modal-title").html("Add Discord Filter");
  $("#save-filter").data("id", "");
  $("#edit-filter-banphrase").prop("value", "");
  $("#edit-filter-enabled").prop("checked", true);
  $("#edit-filter-method-one").prop("checked", true);
  $("#edit-filter-method-all").prop("checked", false);
  $("#edit-filter-exclude-mods").prop("checked", true);
  $("#edit-filter-exclude-helpers").prop("checked", true);
  $("#edit-filter-exclude-wiki").prop("checked", false);
  $("#edit-filter-exclude-staff").prop("checked", false);
  $("#edit-filter-exclude-admins").prop("checked", false);
  $("#edit-filter-exclude-global-mods").prop("checked", false);
  $("#edit-filter-exclude-contributors").prop("checked", false);
  $("#edit-filter-exclude-profiles").prop("checked", false);
  $("#edit-filter-exclude-twoos").prop("checked", false);
});

$(document).delegate("#edit-filter", "click", function() {
  var id = $(this).data("id");
  $("#filter-modal-title").html("Edit Discord Filter");
  $("#save-filter").data("id", id);
  $.post("/admin/discord/filters/get", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#edit-filter-banphrase").val(data.data.banphrase);
      $("#edit-filter-enabled").prop("checked", (data.data.enabled === true));
      $("#edit-filter-method-one").prop("checked", (data.data.exclusions.method == "one"));
      $("#edit-filter-method-all").prop("checked", (data.data.exclusions.method == "all"));
      $("#edit-filter-exclude-mods").prop("checked", data.data.exclusions.mods);
      $("#edit-filter-exclude-helpers").prop("checked", data.data.exclusions.helpers);
      $("#edit-filter-exclude-wiki").prop("checked", data.data.exclusions.wiki);
      $("#edit-filter-exclude-staff").prop("checked", data.data.exclusions.staff);
      $("#edit-filter-exclude-admins").prop("checked", data.data.exclusions.admins);
      $("#edit-filter-exclude-global-mods").prop("checked", data.data.exclusions.global_mods);
      $("#edit-filter-exclude-contributors").prop("checked", data.data.exclusions.contributors);
      $("#edit-filter-exclude-profiles").prop("checked", data.data.exclusions.profiles);
      $("#edit-filter-exclude-twoos").prop("checked", data.data.exclusions.twoos);
      if (data.data.exclusions.twoos === true) {
        $("#edit-filter-exclude-twoos-value").prop("disabled", false);
        $("#edit-filter-exclude-twoos-value").prop("value", data.data.exclusions.twoos_value);
      }
      else {
        $("#edit-filter-exclude-twoos-value").prop("disabled", true);
        $("#edit-filter-exclude-twoos-value").prop("value", "");
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

$(document).delegate("#delete-filter", "click", function() {
  var id = $(this).data("id");
  $.post("/admin/discord/filters/delete", {
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

$(document).delegate("#save-filter", "click", function() {
  var id = $(this).data("id"),
      banphrase = $("#edit-filter-banphrase").val(),
      enabled = $("#edit-filter-enabled").is(":checked"),
      exclusions = {};

  if ($("#edit-filter-method-all").prop("checked")) {
    exclusions.method = "all";
  }
  else {
    exclusions.method = "one";
  }
  exclusions.mods = $("#edit-filter-exclude-mods").prop("checked");
  exclusions.helpers = $("#edit-filter-exclude-helpers").prop("checked");
  exclusions.wiki = $("#edit-filter-exclude-wiki").prop("checked");
  exclusions.staff = $("#edit-filter-exclude-staff").prop("checked");
  exclusions.admins = $("#edit-filter-exclude-admins").prop("checked");
  exclusions.global_mods = $("#edit-filter-exclude-global-mods").prop("checked");
  exclusions.contributors = $("#edit-filter-exclude-contributors").prop("checked");
  exclusions.profiles = $("#edit-filter-exclude-profiles").prop("checked");
  exclusions.twoos = $("#edit-filter-exclude-twoos").prop("checked");
  if (exclusions.twoos === true) {
    exclusions.twoos_value = $("#edit-filter-exclude-twoos-value").val();
  }

  if (!banphrase || (exclusions.twoos === true && exclusions.twoos_value < 0) || (exclusions.twoos === true && !exclusions.twoos_value)) {
    if (!banphrase) {
      $("#edit-filter-banphrase").addClass("invalid");
    }
    if (!response) {
      $("#edit-filter-response").addClass("invalid");
    }
    if ((exclusions.twoos === true && exclusions.twoos_value < 0) || (exclusions.twoos === true && !exclusions.twoos_value)) {
      $("#edit-filter-exclude-twoos-value").addClass("invalid");
    }
    setTimeout(function() {
      $("#edit-filter-trigger").removeClass("invalid");
      $("#edit-filter-response").removeClass("invalid");
      $("#edit-filter-exclude-twoos-value").removeClass("invalid");
    }, 3000);
    Materialize.toast("You have not filled out all fields correctly.", 4000, "rounded");
  }
  else {
    if (id) {
      $.post("/admin/discord/filters/edit", {
        id: id,
        banphrase: banphrase,
        enabled: enabled,
        exclusions: exclusions
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
    }
    else {
      $.post("/admin/discord/filters/add", {
        banphrase: banphrase,
        enabled: enabled,
        exclusions: exclusions
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
    }
  }
});
