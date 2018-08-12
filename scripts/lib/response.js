'use strict';

const ServerResponse  = require( 'http' ).ServerResponse;
const baseForIn       = require( 'peako/base/base-for-in' );
const serializeCookie = require( './serialize-cookie' );
const response = Object.create( ServerResponse.prototype );

response.redirect = function redirect ( url, status ) {
  // throw Error( url );
  this.statusCode = status || 302;
  this.setHeader( 'Location', url );
  this.end();
};

response.append = function append ( field, value ) {
  let current = this.getHeader( field );

  if ( typeof current === 'undefined' ) {
    current = [];
  } else if ( typeof current === 'string' ) {
    current = [ current ];
  }

  this.setHeader( field, current.concat( value ) );
};

response.cookie = function cookie ( key, value, options ) {
  this.append( 'Set-Cookie', serializeCookie( key, value, options ) );
};

response.render = function render ( view, data ) {
  const engine = this.router.settings[ 'view engine' ];

  if ( ! engine ) {
    throw Error( 'no render engine' );
  }

  this.html( engine.render( view, data ) );
};

baseForIn( { text: 'text/plain; charset=UTF-8', html: 'text/html; charset=UTF-8', json: 'application/json' }, ( type, method ) => {
  response[ method ] = function ( value ) {
    this.setHeader( 'Content-Type', type );
    this.end( value );
  };
}, void 0, true, [ 'text', 'html' ] );

module.exports = response;
