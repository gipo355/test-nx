export const accessCookieOptions = {
  path: '/',
  maxAge: 1000 * 60 * 60 * 1,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
  httpOnly: true,
};
export const refreshCookieOptions = {
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  httpOnly: true,
};
export const verifyCookieOptions = {
  path: '/',
  maxAge: 1000 * 60 * 10,
  expires: new Date(Date.now() + 1000 * 60 * 10),
  httpOnly: true,
};
