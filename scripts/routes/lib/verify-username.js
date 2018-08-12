'use strict';

module.exports = function verify_username ( username ) {
  if ( typeof username !== 'string' || ! ( username = username.trim() ) ) {
    return 'Пожалуйста, ведите имя';
  }

  if ( username.length < 2 ) {
    return 'Имя не должно быть короче 2 символов (сейчас ' + username.length + ')';
  }

  if ( username.length > 16 ) {
    return 'Имя не должно быть длиннее 16 символов (сейчас ' + username.length + ')';
  }

  if ( /^\d+$/.test( username ) ) {
    return 'Имя не может содержать только цифры';
  }

  if ( ! /^[\wа-яё -]+$/i.test( username ) ) {
    return 'Имя может содержать только английские и русские буквы, цифры (не может содержать только цифры), дефисы, и подчеркивания';
  }
};
