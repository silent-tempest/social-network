'use strict';

const { createServer } = require( 'https' );
const router = require( './router' );

module.exports = createServer( require( '../config/ssl' ), router.handle.bind( router ) );
