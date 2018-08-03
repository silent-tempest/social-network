'use strict';

var _response = require( '../lib/response' );
var _request  = require( '../lib/request' );

module.exports = function initialize ( request, response, next ) {
  Object.setPrototypeOf( response, _response );
  Object.setPrototypeOf( request, _request );
  next();
};
