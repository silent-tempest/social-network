'use strict';

let { ServerResponse } = require( 'http' );
let serialize          = require( 'super-cookie/lib/serialize' );
let mime               = require( 'mime' );

let Response = {
  /**
   * @param {Router} router
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  update ( router, request, response ) {
    Reflect.setPrototypeOf( response, Response.prototype );
    response.request = request;
    response.router = router;
  }
};

Response.prototype = Object.assign( Object.create( ServerResponse.prototype ), {

  /**
   * @param {string|object} field
   * @param {string} [value]
   * @chainable
   */
  header ( field, value ) {

    if ( typeof field !== 'object' || field === null ) {
      if ( field === 'Content-Type' && ( value === 'text/html' || value === 'text/plain' ) ) {
        value += '; charset=UTF-8';
      }

      this.setHeader( field, value );
    } else {
      for ( let keys = Object.keys( field ), i = 0, l = keys.length; i < l; ++i ) {
        this.header( keys[ i ], field[ keys[ i ] ] );
      }
    }

    return this;

  },

  /**
   * @param {string} type
   * @chainable
   * @example
   * type( './dist/index.js' );  // Content-Type: 'application/javascript'
   * type( 'application/json' ); // Content-Type: 'application/json'
   * type( 'html' );             // Content-Type: 'text/html'
   * type( 'xyz' );              // no Content-Type
   */
  type ( type ) {

    if ( type.indexOf( '/' ) < 0 || ! mime.getExtension( type ) ) {
      type = mime.getType( type );
    }

    if ( type ) {
      this.header( 'Content-Type', type );
    }

    return this;

  },

  /**
   * @param {number} statusCode
   * @chainable
   */
  status ( statusCode ) {

    this.statusCode = statusCode;

    return this;

  },

  /**
   * @param {number} [statusCode=302]
   * @param {string} url
   * @chainable
   */
  redirect ( statusCode, url ) {

    if ( typeof url === 'undefined' ) {
      url = statusCode;
      statusCode = 302;
    }

    if ( url === 'back' ) {
      url = this.request.headers.referer || '/';
    }

    this.statusCode = statusCode;
    this.setHeader( 'Location', url );
    this.end();

    return this;

  },

  /**
   * @param {string} field
   * @param {string} value
   * @chainable
   * @todo should be able to append from an object of headers
   */
  append ( field, value ) {

    let current = this.getHeader( field );

    if ( typeof current === 'undefined' ) {
      current = [];
    } else if ( typeof current === 'string' ) {
      current = [ current ];
    }

    this.setHeader( field, current.concat( value ) );

    return this;

  },

  cookie ( key, value, options ) {

    return this.append( 'Set-Cookie', serialize( key, value, options ) );

  },

  render ( view, data ) {

    let engine = this.router.settings[ 'view engine' ];

    if ( ! engine ) {
      throw Error( 'no view engine' );
    }

    this.setHeader( 'Content-Type', 'text/html; charset=UTF-8' );
    this.end( engine.render( view, data ) );

    return this;

  }

} );

module.exports = Response;
