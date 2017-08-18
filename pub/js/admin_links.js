$(document).delegate("#add-link", "click", function() {
  $("#link-modal-title").html("Add Short Link");
  $("#edit-link-short").val("");
  $("#edit-link-redirect").val("");
  $("#edit-link-enabled").prop("checked", true);
  $("#save-link").data("id", "");
});

$(document).delegate("#edit-link", "click", function() {
  var id = $(this).data("id");
  $.post("/admin/links/get", {
    id: id
  }, function(data) {
    if (data.message == "success") {
      $("#link-modal-title").html("Edit Short Link");
      $("#edit-link-short").val(data.data.short);
      $("#edit-link-redirect").val(data.data.redirect);
      $("#edit-link-enabled").prop("checked", data.data.enabled);
      $("#save-link").data("id", id);
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

$(document).delegate("#delete-link", "click", function() {
  var id = $(this).data("id");
  $.post("/admin/links/delete", {
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

$(document).delegate("#save-link", "click", function() {
  var id = $(this).data("id"),
      short = $("#edit-link-short").val(),
      redirect = $("#edit-link-redirect").val(),
      enabled = $("#edit-link-enabled").is(":checked"),
      short_regex = new RegExp(/^[a-zA-Z0-9_]*$/),
      url_regex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

  if (!short || !redirect) {
    Materialize.toast("You must complete all fields.", 4000, "rounded");
  }
  else if (!short_regex.test(short) || !url_regex.test(redirect)) {
    Materialize.toast("You have entered an invalid value for a field.", 4000, "rounded");
  }
  else {
    if (id) {
      $.post("/admin/links/edit", {
        id: id,
        short: short,
        redirect: redirect,
        enabled: enabled
      }, function(data) {
        if (data.message == "success") {
          location.reload();
        }
        else if (data.message == "exists") {
          Materialize.toast("A short link with that URL already exists.", 4000, "rounded");
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
      $.post("/admin/links/add", {
        short: short,
        redirect: redirect,
        enabled: enabled
      }, function(data) {
        if (data.message == "success") {
          location.reload();
        }
        else if (data.message == "exists") {
          Materialize.toast("A short link with that URL already exists.", 4000, "rounded");
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
