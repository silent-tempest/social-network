'use strict';

var parseQS = require( 'qs/lib/parse' );

function Route ( pattern ) {

  var _params = [];

  var regex;

  if ( typeof pattern === 'string' ) {

    this.url = pattern;

    regex = pattern.replace( /:([_a-z$][_a-z0-9$]*)/gi, function ( match, name ) {

      if ( ~ _params.indexOf( name ) ) {
        throw Error( '"' + name + '" parameter already exists' );
      }

      _params.push( name );

      return '([^/]+?)';

    } );

    this._pattern = RegExp( '^' + regex + '/?' );

    pattern = RegExp( '^' + regex + '/?$' );

  }

  this.handlers = {};
  this.pattern  = pattern;
  this._params  = _params;

}

Route.prototype = {

  /**
   * @param {string|regexp} url
   */

  // route.matches( '/user/:id' )
  // route.matches( /\/\d{3}/ )

  matches: function matches ( url ) {
    if ( this.url ) {
      return this.url === url;
    }

    return this.pattern.source === url.source;
  },

  handles: function handles ( req, url ) {
    return req.method in this.handlers && this.pattern.test( url || req.url );
  },

  _process: function _process ( req ) {
    var self = this;

    return new Promise( function ( res, rej ) {
      var match, i, l;

      req.params = {};
      req.body   = '';

      if ( self._params.length ) {
        match = self.pattern.exec( req.url );

        for ( i = 0, l = self._params.length; i < l; ++i ) {
          req.params[ self._params[ i ] ] = match[ i + 1 ];
        }
      }

      req.on( 'end', function () {
        var type = req.headers[ 'content-type' ];

        try {
          if ( type === 'application/json' ) {
            req.body = JSON.parse( req.body );
          } else if ( type === 'application/x-www-form-urlencoded' ) {
            req.body = parseQS( req.body );
          }

          res();
        } catch ( e ) {
          rej( 400 );
        }
      } );

      req.on( 'data', function ( chunk ) {
        if ( ( req.body += chunk ).length >= 1e6 ) {
          rej( 413 );
        }
      } );
    } );
  },

  handle: function handle ( req, res ) {

    var self = this;

    return this._process( req ).then( function () {
      return self.handlers[ req.method ]( req, res );
    } );

  },

  constructor: Route

};

[ 'GET', 'POST' ].forEach( function ( method ) {
  Route.prototype[ method.toLowerCase() ] = function ( handler ) {

    if ( this.handlers[ method ] ) {
      throw Error( '"' + method + '" method handler already defined' );
    }

    this.handlers[ method ] = handler;

    return this;

  };
} );

module.exports = Route;
