/**
 * ## helper status code
 */

export interface StatusCodes {
  ok: 200;
  created: 201;
  accepted: 202;
  nonAuthoritativeInformation: 203;
  noContent: 204;
  resetContent: 205;
  partialContent: 206;
  multipleChoices: 300;
  movedPermanently: 301;
  found: 302;
  seeOther: 303;
  notModified: 304;
  useProxy: 305;
  temporaryRedirect: 307;
  badRequest: 400;
  unauthorized: 401;
  paymentRequired: 402;
  forbidden: 403;
  notFound: 404;
  methodNotAllowed: 405;
  notAcceptable: 406;
  proxyAuthenticationRequired: 407;
  requestTimeout: 408;
  conflict: 409;
  gone: 410;
  lengthRequired: 411;
  preconditionFailed: 412;
  payloadTooLarge: 413;
  uriTooLong: 414;
  unsupportedMediaType: 415;
  rangeNotSatisfiable: 416;
  expectationFailed: 417;
  imATeapot: 418;
  misdirectedRequest: 421;
  unprocessableEntity: 422;
  locked: 423;
  failedDependency: 424;
  tooEarly: 425;
  upgradeRequired: 426;
  preconditionRequired: 428;
  tooManyRequests: 429;
  requestHeaderFieldsTooLarge: 431;
  unavailableForLegalReasons: 451;
  internalServerError: 500;
  notImplemented: 501;
  badGateway: 502;
  serviceUnavailable: 503;
  gatewayTimeout: 504;
  httpVersionNotSupported: 505;
  variantAlsoNegotiates: 506;
  insufficientStorage: 507;
  loopDetected: 508;
  notExtended: 510;
  networkAuthenticationRequired: 511;
}

export type StatusCodeKey = keyof StatusCodes;

// export const statusCodes: StatusCodes = {
export const statusCodes: StatusCodes = {
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  useProxy: 305,
  temporaryRedirect: 307,
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  uriTooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,
  imATeapot: 418,
  misdirectedRequest: 421,
  unprocessableEntity: 422,
  locked: 423,
  failedDependency: 424,
  tooEarly: 425,
  upgradeRequired: 426,
  preconditionRequired: 428,
  tooManyRequests: 429,
  requestHeaderFieldsTooLarge: 431,
  unavailableForLegalReasons: 451,
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 505,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  notExtended: 510,
  networkAuthenticationRequired: 511,
} as const;

Object.freeze(statusCodes);