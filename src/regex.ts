// eslint-disable-next-line max-len
export const EMAIL_REGULAR_EXPRESSION = new RegExp(
  /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);
export const PASSWORD_REGULAR_EXPRESSION = new RegExp(
  /^(?=.*[A-Z])(?=.*\d)([A-Za-z\d$@$!%*?&]|[^ ]){4,20}$/
);
export const NAME_REGULAR_EXPRESSION = new RegExp(
  /^[a-zA-Z\u00f1\u00d1]+[a-zA-Z\u00f1\u00d1 ]*$/
);
// export const PHONE_REGULAR_EXPRESSION = new RegExp('^[0-9]{8}$');
export const PHONE_REGULAR_EXPRESSION = new RegExp('^[467][0-9]{6,7}$');
