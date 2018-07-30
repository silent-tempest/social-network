'use strict';

module.exports = function AuthorizationError ( fieldname, message ) {
  this.fieldname = fieldname;
  this.message   = message;
};
