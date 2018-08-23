'use strict';

module.exports = new ( require( 'https' ).Server )( require( '../config' ).ssl );
