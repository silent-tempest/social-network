'use strict';

var layout  = require( '../layout' ),
    Route   = require( '../Route' );

module.exports = new Route( '/' ).get( function ( req, res ) {

  res.writeHead( 200, {
    'Content-Type': 'text/html'
  } );

  res.end( layout.render( 'index', null, [
    layout.link( './styles/material-design-components/build/index.min.css' )
  ], [
    layout.script( './build/signup.js' )
  ] ) );

} );
