var authCreds = {
  token: null,
  id: null
};

var petCreds = {
  petId: null,
};

$(document).ready(function() {

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

    petminder_api.get_pet_pic(function() {
      petCb.apply(this, arguments);
      console.log("Dog: ", dogData);
      renderDisplayDogPage(dogData);
    });
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

        // var template = Handlebars.compile($("#beer-index").html());
        //   var newHTML = beerIndexTemplate({beers: data.beers});
        // $('#beers').html(newHTML);
  }
});
});

  $(document).on("click", "#delete-dog", function(e) {
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

$(document).on("click", "#change-dog", function(e) {
    e.preventDefault();
    var token = authCreds.token;
    var petId = $('#change-dog > input[name="pet-id"]').val();
    console.log(petId);

    petminder_api.change_pet(token, petId, changed_pet, function(err, data) {
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

var renderDisplayDogPage = function(dog) {
  var templatingFunction = Handlebars.compile($('#dog-picture-template').html());

  var html = templatingFunction(dog);
  $("#dog-display").html(html);
};

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
