'use strict';

var Route  = require( '../Route' ),
    layout = require( '../layout' ),
    read   = require( '../read' );

module.exports = new Route( '/user/:id' ).get( function ( req, res ) {
  return read( './data/users.json' )
    .then( function ( users ) {
      return JSON.parse( users );
    } )
    .then( function ( users ) {

      var user = users.find( function ( { id, alias } ) {
        return id === req.params.id || alias === req.params.id;
      } );

      if ( ! user ) {
        return res.redirect( '/wrong/?status=404&message=user not found' );
      }

      res.writeHead( 200, {
        'Content-Type': 'text/html; charset=UTF-8'
      } );

      var head = [
        layout.link( './dist/styles/user.bundle.min.css/' )
      ];

      var body = [
        layout.script( './dist/scripts/user.bundle.min.js/' )
      ];

      res.end( layout.render( 'user', { session: req.session, user }, head, body ) );

    } );
} );
