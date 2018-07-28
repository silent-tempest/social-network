'use strict';

var https       = require( 'https' ),
    http        = require( 'http' ),
    fs          = require( 'fs' ),
    parseCookie = require( './scripts/parse-cookie' ),
    parseQuery  = require( './scripts/parse-query' ),
    router      = require( './scripts/router' );

var options = {
  cert: fs.readFileSync( './server-certificate.cert' ),
  key:  fs.readFileSync( './server-key.key' )
};

if ( ! fs.readFileSync( './data/users.json', 'utf8' ) ) {
  fs.writeFileSync( './data/users.json', '[]' );
}

http.ServerResponse.prototype.redirect = function redirect ( Location ) {
  this.statusCode = 302;
  this.setHeader( 'Location', Location );
  this.end();
};

var server = https.createServer( options, function ( req, res ) {

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

} );

server.listen( 9000, function () {
  console.log( 'listening on "https://localhost:9000/"...' );
} );
