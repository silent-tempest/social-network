'use strict';

var https       = require( 'https' ),
    http        = require( 'http' ),
    parseCookie = require( './scripts/parse-cookie' ),
    parseQuery  = require( './scripts/parse-query' ),
    router      = require( './scripts/router' ),
    write       = require( './scripts/write' ),
    read        = require( './scripts/read' );

var options;

Promise.all( [
  read( './server-certificate.cert' ),
  read( './server-key.key' ),
  read( './data/users.json' )
] )
  .then( function ( data ) {
    options = {
      cert: data[ 0 ],
      key:  data[ 1 ]
    };

    if ( ! data[ 2 ] ) {
      return write( './data/users.json', '[]' );
    }
  } )
  .then( function () {
    https.createServer( options, listener ).listen( 9000, function () {
      console.log( 'listening on "https://localhost:9000/"...' );
    } );
  } );

function listener ( req, res ) {
  var route;

  parseCookie( req );
  parseQuery( req );

  if ( req.method === 'GET' && req.url.charAt( req.url.length - 1 ) !== '/' ) {
    if ( req.rawQuery ) {
      res.redirect( req.url + '/?' + req.rawQuery );
    } else {
      res.redirect( req.url + '/' );
    }

    return;
  }

  if ( ! ( route = router.route( req ) ) ) {
    return res.redirect( '/wrong/?status=404&message=Resource not found' );
  }

  route.handle( req, res ).catch( function ( statusCode ) {
    if ( typeof statusCode !== 'number' ) {
      console.log( statusCode );
      statusCode = 500;
    }

    res.statusCode = statusCode;

    if ( statusCode === 413 ) {
      req.connection.destroy();
    } else {
      res.end();
    }
  } );
}

http.ServerResponse.prototype.redirect = function redirect ( Location ) {
  this.statusCode = 302;
  this.setHeader( 'Location', Location );
  this.end();
};
