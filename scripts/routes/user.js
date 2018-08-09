'use strict';

const { user } = require( '../database' );
const engine = require( '../engine' );
const Route = require( '../lib/Route' );

module.exports = new Route( '/user/:id' ).get( ( request, response, next ) => {
  user( request.params.id, request.session.user ).then( ( data ) => {
    if ( ! data.rows[ 0 ] ) {
      return next();
    }

    response.statusCode = 200; // ok
    response.render( 'user2', {
      user: data.rows[ 0 ],
      head: [ engine.link( '../../dist/styles/user2.bundle.min.css' ) ],
      body: [ engine.script( '../../dist/scripts/user2.bundle.min.js' ) ],
      loggedAs: request.session.user
    } );
  } );
} );
