'use strict';

if ( top !== self ) {
  top.location = self.location;
}

[].forEach.call(document.querySelectorAll('.input--group'), require('@components/input'));

var debounce        = require('peako/debounce');
var ajax            = require('peako/ajax');
var verify_username = require('../../scripts/routes/lib/verify-username');
var verify_password = require('../../scripts/routes/lib/verify-password');

var headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

(function () {
  var username = document.forms.login.elements.username;
  var password = document.forms.login.elements.password;
  var helper = {
    username: document.getElementById(username.dataset.helper),
    password: document.getElementById(password.dataset.helper)
  };
  var disabled;

  function listener() {
    var data = {
      username: username.value.trim(),
      password: password.value
    };

    success({ field: 'username', message: verify_username(data.username) || null });
    success({ field: 'password', message: verify_password(data.password) || null });
  }

  function success(data) {
    // jshint validthis: true
    if (data.message !== null && (!this || this.status !== 200)) {
      helper[data.field].innerHTML = data.message || this.status + ': ' + this.statusText;
      toggle(true);
    } else {
      helper[data.field].innerHTML = '';
      toggle(false);
    }
    // jshint validthis: false
  }

  function toggle(state) {
    document.forms.login.elements.submit.disabled = disabled = state;
  }

  toggle(true);

  document.forms.login.addEventListener('submit', function onsubmit(event) {
    if (disabled) {
      event.preventDefault();
    }
  }, false);

  username.addEventListener('change', listener, false);
  username.addEventListener('input', listener, false);
  password.addEventListener('change', listener, false);
  password.addEventListener('input', listener, false);
})();

(function () {
  var username = document.forms.signup.elements.username;
  var helper   = document.getElementById(username.dataset.helper);
  var disabled;

  var debounced = debounce(100, function (data) {
    ajax('/signup/?step=0', {
      headers: headers,
      success: success,
      error: success,
      data: data
    });
  }).debounced;

  function listener() {
    var data = {
      username: username.value.trim()
    };

    var message = verify_username(data.username);

    if (message) {
      success(message);
    } else {
      debounced(data);
    }
  }

  function success(message) {
    // jshint validthis: true
    if (message !== null && (!this || this.status !== 200)) {
      helper.innerHTML = message || this.status + ': ' + this.statusText;
      toggle(true);
    } else {
      helper.innerHTML = '';
      toggle(false);
    }
    // jshint validthis: false
  }

  function toggle(state) {
    document.forms.signup.elements.submit.disabled = disabled = state;
  }

  toggle(true);

  document.forms.signup.addEventListener('submit', function onsubmit(event) {
    if (disabled) {
      event.preventDefault();
    }
  }, false);

  username.addEventListener('change', listener, false);
  username.addEventListener('input', listener, false);
})();
