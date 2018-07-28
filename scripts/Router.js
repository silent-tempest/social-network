'use strict';

var method = require( 'peako/method' ),
    find   = require( 'peako/find' ),
    mime   = require( 'mime' ),
    path   = require( 'path' ),
    Route  = require( './Route' ),
    read   = require( './read' );

function Router () {
  this.routes = [];
}

Router.prototype = {

  route: function route ( req, url ) {

    var route, i, l;

    if ( ! url ) {
      url = req.url;
    }

    if ( url.charAt( url.length - 1 ) !== '/' && ( route = this.route( req, url + '/' ) ) ) {
      return route;
    }

    for ( i = 0, l = this.routes.length; i < l; ++i ) {
      if ( this.routes[ i ].handles( req, url ) ) {
        return this.routes[ i ];
      }
    }

  },

  static: function ( folder ) {

    var self = this;

    return this.get( /\.[a-z\-]+\/$/i, function ( req, res ) {

      var url = req.url.slice( 0, -1 );

      var filepath = url;

      var i, l, test, headers;

      for ( i = 0, l = self.routes.length; i < l; ++i ) {
        test = url.replace( self.routes[ i ]._pattern || self.routes[ i ].pattern, '' );

        if ( test.length < filepath.length ) {
          filepath = test;
        }
      }

      filepath = path.join( folder, filepath );

      if ( ( test = mime.getType( filepath ) ) ) {
        headers = {
          'Content-Type': test
        };
      }

      read( filepath )
        .then( function ( file ) {
          res.writeHead( 200, headers );
          res.end( file );
        } )
        .catch( function () {
          res.writeHead( 400, headers );
          res.end();
        } );

    } );

  },

  handle: function handle ( route ) {

    if ( find( this.routes, method( 'matches', route.url || route.pattern ) ) ) {
      throw Error();
    }

    this.routes.push( route );

    return this;

  },

  constructor: Router

};

[ 'get', 'post' ].forEach( function ( methodName ) {
  Router.prototype[ methodName ] = function ( url, handler ) {

    var route = find( this.routes, method( 'matches', url ) );

    if ( ! route ) {
      this.routes.push( route = new Route( url )[ methodName ]( handler ) );
    } else {
      route[ methodName ]( handler );
    }

    return this;

  };
} );

module.exports = Router;
