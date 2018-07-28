'use strict';

var Route  = require( '../Route' ),
    layout = require( '../layout' ),
    read   = require( '../read' );

module.exports = new Route( '/user/:id' ).get( function ( req, res ) {
  read( './data/users.json' )
    .then( function ( users ) {
      return JSON.parse( users );
    } )
    .then( function ( users ) {

      var user = users.find( function ( { id, alias } ) {
        return id === req.params.id || alias === req.params.id;
      } );

      if ( ! user ) {
        return res.redirect( '/wrong/?status=404&message=User not found' );
      }

      res.writeHead( 200, {
        'Content-Type': 'text/html; charset=UTF-8'
      } );

      res.end( layout.render( 'user', user ) );

    } );
} );
