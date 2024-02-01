import escape from 'validator/lib/escape';
import isAscii from 'validator/lib/isAscii';
import trim from 'validator/lib/trim';

export const sanitizePasswords = (...passwords: string[]) =>
  //
  passwords.map((password) => {
    let sanitized = escape(password);
    sanitized = trim(password);
    return sanitized;
  });

export const areAllPasswordsValidAscii = (...passwords: string[]) => {
  const validatedPasswords = passwords.map((password) => isAscii(password));
  return validatedPasswords.every(Boolean);
};

export const sanitizeReview = (review: string) => {
  let sanitized = escape(review);
  sanitized = trim(review);
  return sanitized;
};

export const isReviewValidAscii = (review: string) => isAscii(review);
