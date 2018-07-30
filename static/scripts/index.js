'use strict';

var textfield = require( '@material/textfield' );
var ripple    = require( '@material/ripple' );
var _         = require( 'peako/_' );

_( '.mdc-text-field' ).each( function () {
  new textfield.MDCTextField( this ); // jshint ignore: line
} );

_( '.mdc-button' ).each( function () {
  new ripple.MDCRipple( this ); // jshint ignore: line
} );
