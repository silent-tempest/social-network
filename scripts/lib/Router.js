'use strict';

var Route = require( './Route' );

function Router () {
  this._routes = [];
}

Router.prototype = {
  route: function route ( path ) {

    var route = new Route( path );

    this._routes.push( route );

    return route;

  },

  use: function use ( path ) {
    var length = arguments.length;

    var offset, handler;

    if ( typeof path === 'string' || path instanceof RegExp ) {
      offset = 1;
    } else {
      path = '*';
      offset = 0;
    }

    for ( ; offset < length; ++offset ) {
      handler = arguments[ offset ];

      if ( ! ( handler instanceof Route ) ) {
        handler = new Route( path ).all( handler );
      }

      this._routes.push( handler );
    }

    return this;
  },

  handle: function handle ( request, response ) {
    var self = this;

    var i = 0;

    function next ( error ) {
      var l = self._routes.length;

      var route;

      for ( l = self._routes.length; i < l; ) {
        route = self._routes[ i++ ];

        if ( ! route._handles( request ) ) {
          continue;
        }

        return route
          ._process( request )
          ._handle( request, response, next, error, arguments.length );
      }
    }

    next();
  },

  constructor: Router
};

require( './methods' ).forEach( function ( method ) {
  method = method.toLowerCase();

  Router.prototype[ method ] = function ( path, handler ) {

    var route = this.route( path );

    route[ method ]( handler );

    return this;

  };
} );

module.exports = Router;
