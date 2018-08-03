'use strict';

var layout = require( '../layout' );
var Route  = require( '../lib/Route' );

module.exports = new Route( '/wrong' ).get( function ( req, res ) {

  res.writeHead( 400, {
    'Content-Type': 'text/html'
  } );

  res.end( layout.render( 'wrong', req.query ) );

} );
