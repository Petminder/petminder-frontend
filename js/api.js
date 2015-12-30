var petminder_api = {
  url: 'https://desolate-beach-8919.herokuapp.com',

  ajax: function (config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function (credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/register',
      contentType: 'application/json',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
    console.log(credentials);
    debugger;
  },

  login: function (credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/login',
      contentType: 'application/json',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
    console.log(credentials);
  },

  logout: function (token, id, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/logout/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json',
      dataType: 'json'
    }, callback);
    console.log("logout success");
  },

  get_pets: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/pets',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

  get_pet_pic: function (callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/pets/'
    }, callback);
  },

  get_pet_info: function (token, petId, callback){
    this.ajax({
      method: 'GET',
      url: this.url + '/pets/' + petId
    });
  },

  add_pet: function (token, pet_info, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/pets',
      headers: {
        Authorization: 'Token token=' + token
      },
      data: pet_info,
      dataType: 'json'
    }, callback);
  },

  delete_pet: function (token, petId, callback){
    this.ajax({
      method: 'DELETE',
      url: this.url + '/pets/' + petId,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  change_pet: function (token, petId, diff_pet , callback){
    this.ajax({
      method: 'PATCH',
      url: this.url + '/pets/' + petId,
      headers: {
        Authorization: 'Token token=' + token
      },
      data: JSON.stringify(diff_pet),
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

};
