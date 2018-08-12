'use strict';

module.exports = ( router ) => {
  const initialize = ( request, response, next ) => {
    Object.setPrototypeOf( response, router.response );
    Object.setPrototypeOf( request, router.request );
    next();
  };

  return initialize;
};
