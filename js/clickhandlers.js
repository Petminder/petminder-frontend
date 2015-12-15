var authCreds = {
  token: null,
  id: null
};

var petCreds = {
  petId: null,
};

$(document).ready(function() {

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
    var token = $('.token').val();
    var id = $('.id').val();
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
    };
    petminder_api.logout(token, id, cb);
  });

  $('#add-dog').on('submit', function(e){
     e.preventDefault();
     token = authCreds.token;

     var new_dog = wrap('dog', form2object(this));
     console.log("new_dog: ", new_dog);
     petminder_api.add_pet(token, new_dog, function(err, data) {
      if (err) {
        return;
      } else {
        console.log("woo");
      }
    });
  });


// Paperclip focused clickhandlers with AJAX requests built in.  Couldn't seperate cleanly
  $('#dog-form').on('submit', function(e){
    e.preventDefault();
    var reader = new FileReader();
    reader.onload = function(event){
      $.ajax({
        url: 'http://localhost:3000/pets/' + '2',
        method: 'PATCH',
        data: { pet: {
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
debugger
    var $fileInput = $('#doc-form');
    reader.readAsDataURL($fileInput[0].files[0]);
  });

var renderDisplayDogPage = function(dog) {
  console.log("dog: ", dog);
  var templatingFunction = Handlebars.compile($('#dog-picture-template').html());
  console.log("templatingFunction: ", templatingFunction);

  var html = templatingFunction(dog);
  console.log("render template html: ", html);
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
