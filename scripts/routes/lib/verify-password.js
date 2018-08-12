'use strict';

module.exports = function verify_password ( password ) {
  if ( typeof password !== 'string' || ! password ) {
    return 'Пожалуйста, введите пароль';
  }

  if ( password.length < 6 ) {
    return 'Пароль не должен быть короче 6 символов (сейчас ' + password.length + ')';
  }

  if ( password.length > 48 ) {
    return 'Пароль не должен быть длиннее 48 символов (сейчас ' + password.length + ')';
  }

  if ( ! /[0-9]/.test( password ) ) {
    return 'Пароль должен содержать хотя бы одну цифру';
  }

  if ( ! /[a-zа-яё]/.test( password ) ) {
    return 'Пароль должен содержать хотя бы одну строчную букву';
  }

  if ( ! /[A-ZА-ЯЁ]/.test( password ) ) {
    return 'Пароль должен содержать хотя бы одну прописную букву';
  }
};
