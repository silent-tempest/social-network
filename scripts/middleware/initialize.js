'use strict';

module.exports = ( router ) => {
  return ( request, response, next ) => {
    Object.setPrototypeOf( response, router.response );
    Object.setPrototypeOf( request, router.request );
    next();
  };
};
