/* jshint esversion: 5 */

'use strict';

var initialize = require( '../middleware/initialize' );
var response   = require( './response' );
var request    = require( './request' );
var Route      = require( './Route' );

function Router () {
  this.routes   = [];
  this.settings = {};
  this.response = Object.create( response );
  this.request  = Object.create( request );
  this.request.router = this.response.router = this;
  this.use( initialize( this ) );
}

Router.prototype = {
  use: function use ( path ) {
    var offset, handler;

    if ( typeof path === 'string' || path instanceof RegExp ) {
      offset = 1;
    } else {
      path = '*';
      offset = 0;
    }

    for ( ; offset < arguments.length; ++offset ) {
      handler = arguments[ offset ];

      if ( ! ( handler instanceof Route ) ) {
        handler = new Route( path ).all( handler );
      }

      this.routes.push( handler );
    }

    return this;
  },

  handle: function handle ( request, response ) {
    var self  = this;
    var index = 0;

    function next ( error ) {
      var length = self.routes.length;
      var route;

      while ( index < length ) {
        route = self.routes[ index++ ];

        if ( ! route._handles( request ) ) {
          continue;
        }

        return route
          ._process( request )
          ._handle( request, response, next, error, arguments.length );
      }

      if ( arguments.length ) {
        throw error;
      }
    }

    next();
  },

  set: function set ( key, value ) {
    this.settings[ key ] = value;
    return this;
  },

  constructor: Router
};

require( './methods' ).concat( 'ALL' ).forEach( function ( method ) {
  method = method.toLowerCase();

  Router.prototype[ method ] = function ( path, handler ) {
    this.routes.push( new Route( path )[ method ]( handler ) );
    return this;
  };
} );

module.exports = Router;
