var authCreds = {
  token: null,
  id: null
};

var petCreds = {
  petId: null,
};

$(document).ready(function() {

$('#services').hide();

var dogIndexTemplate = Handlebars.compile($('#dogs').html());

var form2object = function(form) {
  var data = {};
    $(form).find('input').each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !=='hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };

  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' + error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };

// User authentication click handlers
  $('#register').on('submit', function(e) {
    e.preventDefault();
    var credentials = wrap('credentials', form2object(this));
    petminder_api.register(credentials, callback);
    $('#register').hide();
  });

 $('#log-in').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
      authCreds.token = data.user.token;
      authCreds.id = data.user.id;
      callback(null, data);
    };

    e.preventDefault();
    petminder_api.login(credentials, cb);
    $('#woof').hide();
    $('#info').hide();
    $('#services').show();
    });

  $('#logout').on('click', function(e) {
    var token = authCreds.token;
    var id = authCreds.id;
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
    };
    petminder_api.logout(token, id, cb);
  });


// Dog focused click handlers
  $('#get-dogs').on('click', function(e){
    var token = authCreds.token;

    petminder_api.get_pets(token, function(err, data) {
      console.log(data);
      if (err) {
        console.log(err);
        return;
      } else {
        var templateTarget = $('#dog-index-template').html();
        var template = Handlebars.compile(templateTarget);
        var content = template(data);
        $('#dogs').html(content);
        }
      });
    });

  $('#dogs').on("click", "button[data-type=delete]", function(e) {
    e.preventDefault();
    var token = authCreds.token;
    var petId = $(this).data("id");
    console.log(petId);

    petminder_api.delete_pet(token, petId, function(err, data) {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(data);
      }
    });
  });

  $('#dogs').on("click", 'button[data-type="edit"]', function(e) {
    e.preventDefault();
    var token = authCreds.token;
    var petId = $(this).data("id");

    $(e.target).parent().parent().children().children(".doggy").hide();
    $(e.target).parent().parent().children().children(".bosshoggy").show();
  });

  $('#dogs').on('click', 'button[data-type="commit"]', function(e){
    e.preventDefault();
    var token = authCreds.token;
    var petId = $(this).data("id");

    // username: $('[data-field=username data-id=' + profileid + ']').val(),

    var diff_pet = {
      pet: {
      name: $('[data-field=name][data-id='+ petId +']').val(),
      dob: $('[data-field=dob][data-id='+ petId +']').val(),
      last_rabies: $('[data-field=last_rabies][data-id='+ petId +']').val(),
      last_tick: $('[data-field="last_tick"][data-id='+ petId +']').val(),
      last_heartworm: $('[data-field=last_heartworm][data-id='+ petId +']').val()
    }
  };
  console.log(diff_pet)
  debugger;

    petminder_api.change_pet(token, petId, diff_pet, function(e){
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(data);
      }
    });
  });


// Paperclip focused clickhandlers with AJAX requests built in.  Couldn't seperate cleanly
  $('#add-dog-form').on('submit', function(e){
    e.preventDefault();
    token = authCreds.token;
    var reader = new FileReader();

    var new_dog = form2object(this);
    console.log("new_dog: ", new_dog);

    reader.onload = function(event){
      new_dog.dog_pic = event.target.result;
      console.log("new_dog with dog_pic:: ", new_dog);

      $.ajax({
        url: 'http://localhost:3000/pets/',
        method: 'POST',
        data: { pet: new_dog
      }, headers: {
          Authorization: 'Token token=' + authCreds.token
        }

      }).done(function(response){
        console.log("response: ", response);
        console.log("F YEAH! SUCCESS!!!!");
      }).fail(function(response){
        console.error("Whoops!");
      });
    };
    var $fileInput = $('#dog-pic');
    reader.readAsDataURL($fileInput[0].files[0]);
  });

  $('#doc-form').on('submit', function(e){
    e.preventDefault();
    var reader = new FileReader();
    reader.onload = function(event){
      $.ajax({
        url: 'http://localhost:3000/documents/',
        method: 'POST',
        data: { document: {
          dog_pic: event.target.result
        }
      }, headers: {
          Authorization: 'Token token=' + authCreds.token
        }

      }).done(function(response){

      }).fail(function(response){
        console.error("Whoops!");
      });
    };

    var $fileInput = $('#doc-form');
    reader.readAsDataURL($fileInput[0].files[0]);
  });


var dogData;

var petCb = function cb(error, data) {
  if (error) {
    callback(error);
    return;
  }

  dogData = data;

  callback(null, data);
};

//end Document Ready
});
