'use strict';

var textfield = require( '@material/textfield' );
var ripple    = require( '@material/ripple' );
var ajax      = require( 'peako/ajax' );
var _         = require( 'peako/_' );

_( '.mdc-text-field' ).each( function () {
  this._tf = new textfield.MDCTextField( this );
} );

_( document ).on( 'ontouchstart' in self ? 'ontouchstart' : 'click', '.mdc-button', function () {
  if ( ! this._ripple ) {
    this._ripple = new ripple.MDCRipple( this );
  }
} );

var loginDisabled = true,
    idValidateLogin;

_( [
  document.forms.login.elements.username,
  document.forms.login.elements.password
] ).on( 'keyup', function () {
  if ( typeof idValidateLogin !== 'undefined' ) {
    clearTimeout( idValidateLogin );
  }

  loginDisabled = true;

  document.forms.login.elements.submit.setAttribute( 'disabled', '' );

  if ( this.value ) {
    idValidateLogin = setTimeout( validateLogin, 100 );
  } else {
    _( '#login-' + this.name + '-helper' ).html( '&nbsp;' );
  }
} );

var headers = {
  'Content-Type': 'application/json'
};

function validateLogin () {
  var data = {
    username: document.forms.login.elements.username.value,
    password: document.forms.login.elements.password.value
  };

  function success () {
    _( '#login .mdc-text-field-helper-text' ).html( '&nbsp;' );
    loginDisabled = false;
    document.forms.login.elements.submit.removeAttribute( 'disabled' );
  }

  function error ( data ) {
    if ( data.fieldname && data.message ) {
      _( '#login-' + data.fieldname + '-helper' ).text( data.message );
    }
  }

  ajax( '/login/?validate', { headers, success, error, data } );
}

_( document.forms.login ).on( 'submit', function ( event ) {
  if ( loginDisabled ) {
    event.preventDefault();
  }
} );
