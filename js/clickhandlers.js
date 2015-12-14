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

//end Document Ready
});
