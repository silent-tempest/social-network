'use strict';

var constants = require( '../constants' ),
    layout    = require( '../layout' ),
    Route     = require( '../lib/Route' ),
    user      = require( '../find-user' );

module.exports = new Route( '/' ).get( function ( req, res ) {
  return user( req.cookie, true )
    .then( function ( user ) {
      res.redirect( '/user/' + ( user.alias || user.id ) + '/' );
    } )
    .catch( function ( error ) {
      if ( error !== constants.NO_USER ) {
        throw error;
      }

      res.writeHead( 200, {
        'Content-Type': 'text/html'
      } );

      var head = [
        layout.link( './dist/styles/index.bundle.min.css' )
      ];

      var body = [
        layout.script( './dist/scripts/index.bundle.min.js' )
      ];

      res.end( layout.render( 'index', null, head, body ) );
    } )
    .catch( function ( error ) {
      console.log( error );
      res.redirect( '/wrong/?status=500&message=something went wrong' );
    } );
} );
