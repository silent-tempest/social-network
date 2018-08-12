'use strict';

if ( top !== self ) {
  top.location = self.location;
}

var ajax = require('peako/ajax');

document.forms.message.addEventListener('submit', function onsubmit(event) {
  event.preventDefault();

  ajax(location.pathname, {
    success: function success(message) {
      document.getElementById( 'messages' ).innerHTML += message;
    },

    error: console.error,

    headers: {
      'Content-Type': 'application/json'
    },

    data: {
      message: this.elements.message.value
    }
  });
}, false);
