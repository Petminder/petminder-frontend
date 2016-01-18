var authCreds = {
  token: null,
  id: null,
  email: null
};

var petCreds = {
  petId: null,
};

$(document).ready(function() {

$('#services').hide();
$('#logout').hide();
$('#error').hide();

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
      $(".header-content-inner").hide()
      $('#error').html("<h1>Nice try pooch!  Next time let the humans handle registering.</h1>");
      $('#error').show();
      $('#error').delay(4500).fadeOut();
      $(".header-content-inner").delay(5000).fadeIn();
      $('#register')[0].reset();
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };

// User authentication click handlers
  // $('#register').on('submit', function(e) {
  //   e.preventDefault();
  //   var credentials = wrap('credentials', form2object(this));
  //   $('#register').hide();
  //   $('#error').html("Thank you for registering, please log in!");
  //   $('#error').delay(5000).fadeOut();
  // }, petminder_api.register(credentials, callback)
  // );

 $('#register').on('submit', function(e) {
    e.preventDefault();
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error){
        debugger;
        callback(error);
        return;
      } else {
       $(".header-content-inner").hide()
       $('#register').hide();
       $('#error').html("<h1>Thank you for registering, please log in!</h1>");
       $('#error').show();
       $('#error').delay(4500).fadeOut();
       $(".header-content-inner").delay(5000).fadeIn();
      }
    };
      petminder_api.register(credentials, callback);
  });

 $('#log-in').on('submit', function(e) {
    e.preventDefault();
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        $("#log-in")[0].reset();
        $(".header-content-inner").hide();
        $('#error').html("<h1>Nice try pooch!  Next time let the humans handle logging in.</h1>");
        $('#error').show();
        $('#error').delay(4500).fadeOut();
        $(".header-content-inner").delay(5000).fadeIn();
        return;
      } else {
      authCreds.email = data.user.email;
      authCreds.token = data.user.token;
      authCreds.id = data.user.id;
      callback(null, data);
      getDogCb();
      welcome();

      $('#woof').hide();
      $('#info').hide();
      $('#services').show();

      $('.home-links').hide();
      $('#logout').show();
    }
  };
   petminder_api.login(credentials, cb);

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
    $('#services').hide();
    $('#woof').show();
    $('#info').show();
    $('#logout').hide();
    $('.home-links').show();
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
        $(e.target).parent().parent().children().children().show();
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
        console.log("delete success");
        $(e.target).parent().parent().hide();
      }
    });
  });

  // var deleteCB = function(){
  //   if (err) {
  //       console.error(err);
  //       return;
  //     } else {
  //       console.log("delete success");
  //   $(e.target).parent().parent().children().children(".doggy").hide();
  // };

  $('#dogs').on("click", 'button[data-type="edit"]', function(e) {
    e.preventDefault();
    var token = authCreds.token;
    var petId = $(this).data("id");

    $(e.target).parent().parent().children().children(".doggy").hide();
    $(e.target).parent().parent().children().children(".bosshoggy").show();
  });


// will allow documents to be attached to pets record on edit of dog NOT WORKING
  $('#dogs').on('click', 'button[data-type="commit"]', function(e){
    e.preventDefault();
    var token = authCreds.token;
    var petId = $(this).data("id");

    var reader = new FileReader();

    reader.onload = function(event){

    var diff_pet = {
    pet: {
    name: $('[data-field=name][data-id='+ petId +']').val(),
    dob: $('[data-field=dob][data-id='+ petId +']').val(),
    last_rabies: $('[data-field=last_rabies][data-id='+ petId +']').val(),
    last_tick: $('[data-field=last_tick][data-id='+ petId +']').val(),
    last_heartworm: $('[data-field=last_heartworm][data-id='+ petId +']').val(),
    dog_doc: event.target.result
    }
  };
      console.log("dog_doc: ", diff_pet.dog_doc);
      console.log("diff_pet with dog_doc:: ", diff_pet);

      $.ajax({
        url: 'https://desolate-beach-8919.herokuapp.com/pets/' + petId,
        method: 'PATCH',
        data: { pet: diff_pet
      }, headers: {
          Authorization: 'Token token=' + authCreds.token
        }

      }).done(function(response){
        console.log("UPDATE!! SUCCESS!!!!");
        $('#documents').html(diff_pet.dog_doc).toString();
      }).fail(function(response){
        console.error("Whoops!");
      });
    };
    var $fileInput = $('#dog-doc');
    reader.readAsDataURL($fileInput[0].files[0]);
    getDogCb();
    console.log(diff_pet);
    petminder_api.change_pet(token, petId, diff_pet, function(err, data){
      if (err) {
        console.error(err);
        return;
      } else {
        getDogCb();
      }
    });
  });

// Allows user to cancel edit and return to list of dogs
  $('#dogs').on("click", 'button[data-type="reset"]', function(e) {
    getDogCb();
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
        url: 'https://desolate-beach-8919.herokuapp.com/pets',
        method: 'POST',
        data: { pet: new_dog
      }, headers: {
          Authorization: 'Token token=' + authCreds.token
        }

      }).done(function(response){
        console.log("response: ", response);
        console.log("F YEAH! SUCCESS!!!!");
        getDogCb();
      }).fail(function(response){
        console.error("Whoops!");
      });
    };
    var $fileInput = $('#dog-pic');
    reader.readAsDataURL($fileInput[0].files[0]);
    getDogCb();
  });

  $('#doggy-doc-form').on('submit', function(e){
    e.preventDefault();
    token = authCreds.token;
    var petId = $(this).data("id");
    var reader = new FileReader();

    var diff_pet = form2object(this);
    console.log("diff_pet: ", diff_pet);

    debugger;

    reader.onload = function(event){
      diff_pet.dog_doc = event.target.result;
      console.log("dog_doc: ", dog_doc);
      console.log("new_dog with dog_pic:: ", diff_pet);

      $.ajax({
        url: 'https://desolate-beach-8919.herokuapp.com/pets/' + petId,
        method: 'PATCH',
        data: { pet: diff_pet
      }, headers: {
          Authorization: 'Token token=' + authCreds.token
        }

      }).done(function(response){
        console.log("F YEAH! SUCCESS!!!!");
        getDogCb();
      }).fail(function(response){
        console.error("Whoops!");
      });
    };
    var $fileInput = $('#dog-doc');
    reader.readAsDataURL($fileInput[0].files[0]);
    getDogCb();
  });
  // will allow documents to be added to a pets record seperate of updating dog NOT WORKING

  // $('#doc-form').on('submit', function(e){
  //   e.preventDefault();
  //   var reader = new FileReader();
  //   reader.onload = function(event){
  //     $.ajax({
  //       url: 'http://localhost:3000/documents/',
  //       method: 'POST',
  //       data: { document: {
  //         dog_pic: event.target.result
  //       }
  //     }, headers: {
  //         Authorization: 'Token token=' + authCreds.token
  //       }

  //     }).done(function(response){

  //     }).fail(function(response){
  //       console.error("Whoops!");
  //     });
  //   };

  //   var $fileInput = $('#doc-form');
  //   reader.readAsDataURL($fileInput[0].files[0]);
  // });


// custom callbacks


 var getDogCb = function(){
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
};

var welcome = function(){
   $('#welcome').html("Welcome " + authCreds.email + "!");
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
