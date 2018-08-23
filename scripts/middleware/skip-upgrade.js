'use strict';

function skipUpgrade ( request, response, next ) {
  if ( ! request.query.socket ) {
    next();
  }
}

module.exports = skipUpgrade;
