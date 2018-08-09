'use strict';

if ( top !== self ) {
  top.location = self.location;
}

var { MDCTextField } = require( '@material/textfield' );
var { MDCRipple }    = require( '@material/ripple' );
var ajax             = require( 'peako/ajax' );
var _                = require( 'peako/_' );

var CLICK;

if ( 'ontouchstart' in self ) {
  CLICK = 'touchstart';
} else {
  CLICK = 'mousedown';
}

var headers = {
  'Content-Type': 'application/json'
};

var UI = {
  login: {
    init () {
      var self = this;

      _( [ this.username, this.password ] ).on( 'keyup', function onkeyup () {
        return _onchange.call( this, self, validate );
      } );

      this.$form.on( 'submit', function onsubmit ( event ) {
        if ( self.disabled ) {
          event.preventDefault();
        }
      } );

      function validate () {
        var data = {
          username: self.username.value,
          password: self.password.value
        };

        function success () {
          _( '#login .mdc-text-field-helper-text' ).html( '&nbsp;' );
          self.disabled = false;
          self.$submit.removeAttr( 'disabled' );
        }

        ajax( '/login/?validate', { headers, success, error: _error, data } );
      }
    },

    $submit: _( document.forms.login.elements.submit ),
    $form: _( document.forms.login ),
    username: document.forms.login.elements.username,
    password: document.forms.login.elements.password,
    validateId: null,
    disabled: true,
    name: 'login'
  },

  signup: {
    init () {
      var self = this;

      _( [ this.username ] ).on( 'keyup change', function onchange () {
        return _onchange.call( this, self, validate );
      } );

      this.$form.on( 'submit', function onsubmit ( event ) {
        if ( self.disabled ) {
          event.preventDefault();
        }
      } );

      function validate () {
        var data = {
          username: self.username.value
        };

        function success () {
          _( '#signup .mdc-text-field-helper-text' ).html( '&nbsp;' );
          self.disabled = false;
          self.$submit.removeAttr( 'disabled' );
        }

        ajax( '/signup/?step=0', { headers, success, error: _error, data } );
      }
    },

    $submit: _( document.forms.signup.elements.submit ),
    $form: _( document.forms.signup ),
    username: document.forms.signup.elements.username,
    name: 'signup'
  },

  init () {
    _( document ).on( CLICK, '.mdc-button', function onclick () {
      if ( ! this._ripple ) {
        this._ripple = new MDCRipple( this );
      }
    } );

    _( '.mdc-text-field' ).each( function () {
      this._tf = new MDCTextField( this );
    } );

    this.signup.init();
    this.login.init();
  }
};

function _onchange ( self, validate ) {
  // jshint validthis: true

  if ( self.validateId != null ) {
    clearTimeout( self.validateId );
    self.validateId = null;
  }

  self.disabled = true;
  self.$submit.attr( 'disabled', '' );

  if ( this.value ) {
    self.validateId = setTimeout( validate, 100 );
  } else {
    _( `#${self.name}-${this.name}-helper` ).html( '&nbsp;' );
  }

  // jshint validthis: false
}

function _error ( data ) {
  if ( data.fieldname && data.message ) {
    _( '#${data.fieldname}-helper' ).text( data.message );
  }
}

UI.init();
