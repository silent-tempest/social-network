'use strict';

let parser = require( '../lib/body-parser' );

module.exports = parser( {
  max: {
    URLENCODED: 256,
    TEXT:       8
  },

  extensions: [ 'URLENCODED', 'TEXT' ]
} );
