/**
 * ## helper status code
 */

// const HTTP_STATUS_CODES = {
//     OK: 200,
//     Created: 201,
//     Accepted: 202,
//     'Non-Authoritative Information': 203,
//     'No Content': 204,
//     'Reset Content': 205,
//     'Partial Content': 206,
//     'Multiple Choices': 300,
//     'Moved Permanently': 301,
//     Found: 302,
//     'See Other': 303,
//     'Not Modified': 304,
//     'Use Proxy': 305,
//     'Temporary Redirect': 307,
//     'Bad Request': 400,
//     Unauthorized: 401,
//     'Payment Required': 402,
//     Forbidden: 403,
//     'Not Found': 404,
//     'Method Not Allowed': 405,
//     'Not Acceptable': 406,
//     'Proxy Authentication Required': 407,
//     'Request Timeout': 408,
//     Conflict: 409,
//     Gone: 410,
//     'Length Required': 411,
//     'Precondition Failed': 412,
//     'Payload Too Large': 413,
//     'URI Too Long': 414,
//     'Unsupported Media Type': 415,
//     'Range Not Satisfiable': 416,
//     'Expectation Failed': 417,
//     "I'm a teapot": 418,
//     'Misdirected Request': 421,
//     'Unprocessable Entity': 422,
//     Locked: 423,
//     'Failed Dependency': 424,
//     'Too Early': 425,
//     'Upgrade Required': 426,
//     'Precondition Required': 428,
//     'Too Many Requests': 429,
//     'Request Header Fields Too Large': 431,
//     'Unavailable For Legal Reasons': 451,
//     'Internal Server Error': 500,
//     'Not Implemented': 501,
//     'Bad Gateway': 502,
//     'Service Unavailable': 503,
//     'Gateway Timeout': 504,
//     'HTTP Version Not Supported': 505,
//     'Variant Also Negotiates': 506,
//     'Insufficient Storage': 507,
//     'Loop Detected': 508,
//     'Not Extended': 510,
//     'Network Authentication Required': 511,
// };

// const HTTP_STATUS_CODES = {
//     OK: 200,
//     CREATED: 201,
//     ACCEPTED: 202,
//     NON_AUTHORITATIVE_INFORMATION: 203,
//     NO_CONTENT: 204,
//     RESET_CONTENT: 205,
//     PARTIAL_CONTENT: 206,
//     MULTIPLE_CHOICES: 300,
//     MOVED_PERMANENTLY: 301,
//     FOUND: 302,
//     SEE_OTHER: 303,
//     NOT_MODIFIED: 304,
//     USE_PROXY: 305,
//     TEMPORARY_REDIRECT: 307,
//     BAD_REQUEST: 400,
//     UNAUTHORIZED: 401,
//     PAYMENT_REQUIRED: 402,
//     FORBIDDEN: 403,
//     NOT_FOUND: 404,
//     METHOD_NOT_ALLOWED: 405,
//     NOT_ACCEPTABLE: 406,
//     PROXY_AUTHENTICATION_REQUIRED: 407,
//     REQUEST_TIMEOUT: 408,
//     CONFLICT: 409,
//     GONE: 410,
//     LENGTH_REQUIRED: 411,
//     PRECONDITION_FAILED: 412,
//     PAYLOAD_TOO_LARGE: 413,
//     URI_TOO_LONG: 414,
//     UNSUPPORTED_MEDIA_TYPE: 415,
//     RANGE_NOT_SATISFIABLE: 416,
//     EXPECTATION_FAILED: 417,
//     IM_A_TEAPOT: 418,
//     MISDIRECTED_REQUEST: 421,
//     UNPROCESSABLE_ENTITY: 422,
//     LOCKED: 423,
//     FAILED_DEPENDENCY: 424,
//     TOO_EARLY: 425,
//     UPGRADE_REQUIRED: 426,
//     PRECONDITION_REQUIRED: 428,
//     TOO_MANY_REQUESTS: 429,
//     REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
//     UNAVAILABLE_FOR_LEGAL_REASONS: 451,
//     INTERNAL_SERVER_ERROR: 500,
//     NOT_IMPLEMENTED: 501,
//     BAD_GATEWAY: 502,
//     SERVICE_UNAVAILABLE: 503,
//     GATEWAY_TIMEOUT: 504,
//     HTTP_VERSION_NOT_SUPPORTED: 505,
//     VARIANT_ALSO_NEGOTIATES: 506,
//     INSUFFICIENT_STORAGE: 507,
//     LOOP_DETECTED: 508,
//     NOT_EXTENDED: 510,
//     NETWORK_AUTHENTICATION_REQUIRED: 511,
// };

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
};

// export type StatusCodes = keyof typeof statusCodes;

// type HttpStatusCode =
//     | 'OK'
//     | 'Created'
//     | 'Accepted'
//     | 'Non-Authoritative Information'
//     | 'No Content'
//     | 'Reset Content'
//     | 'Partial Content'
//     | 'Multiple Choices'
//     | 'Moved Permanently'
//     | 'Found'
//     | 'See Other'
//     | 'Not Modified'
//     | 'Use Proxy'
//     | 'Temporary Redirect'
//     | 'Bad Request'
//     | 'Unauthorized'
//     | 'Payment Required'
//     | 'Forbidden'
//     | 'Not Found'
//     | 'Method Not Allowed'
//     | 'Not Acceptable'
//     | 'Proxy Authentication Required'
//     | 'Request Timeout'
//     | 'Conflict'
//     | 'Gone'
//     | 'Length Required'
//     | 'Precondition Failed'
//     | 'Payload Too Large'
//     | 'URI Too Long'
//     | 'Unsupported Media Type'
//     | 'Range Not Satisfiable'
//     | 'Expectation Failed'
//     | "I'm a teapot"
//     | 'Misdirected Request'
//     | 'Unprocessable Entity'
//     | 'Locked'
//     | 'Failed Dependency'
//     | 'Too Early'
//     | 'Upgrade Required'
//     | 'Precondition Required'
//     | 'Too Many Requests'
//     | 'Request Header Fields Too Large'
//     | 'Unavailable For Legal Reasons'
//     | 'Internal Server Error'
//     | 'Not Implemented'
//     | 'Bad Gateway'
//     | 'Service Unavailable'
//     | 'Gateway Timeout'
//     | 'HTTP Version Not Supported'
//     | 'Variant Also Negotiates'
//     | 'Insufficient Storage'
//     | 'Loop Detected'
//     | 'Not Extended'
//     | 'Network Authentication Required';
// export const statusCodes = new Map<HttpStatusCode, number>([
//     ['OK', 200],
//     ['Created', 201],
//     ['Accepted', 202],
//     ['Non-Authoritative Information', 203],
//     ['No Content', 204],
//     ['Reset Content', 205],
//     ['Partial Content', 206],
//     ['Multiple Choices', 300],
//     ['Moved Permanently', 301],
//     ['Found', 302],
//     ['See Other', 303],
//     ['Not Modified', 304],
//     ['Use Proxy', 305],
//     ['Temporary Redirect', 307],
//     ['Bad Request', 400],
//     ['Unauthorized', 401],
//     ['Payment Required', 402],
//     ['Forbidden', 403],
//     ['Not Found', 404],
//     ['Method Not Allowed', 405],
//     ['Not Acceptable', 406],
//     ['Proxy Authentication Required', 407],
//     ['Request Timeout', 408],
//     ['Conflict', 409],
//     ['Gone', 410],
//     ['Length Required', 411],
//     ['Precondition Failed', 412],
//     ['Payload Too Large', 413],
//     ['URI Too Long', 414],
//     ['Unsupported Media Type', 415],
//     ['Range Not Satisfiable', 416],
//     ['Expectation Failed', 417],
//     ["I'm a teapot", 418],
//     ['Misdirected Request', 421],
//     ['Unprocessable Entity', 422],
//     ['Locked', 423],
//     ['Failed Dependency', 424],
//     ['Too Early', 425],
//     ['Upgrade Required', 426],
//     ['Precondition Required', 428],
//     ['Too Many Requests', 429],
//     ['Request Header Fields Too Large', 431],
//     ['Unavailable For Legal Reasons', 451],
//     ['Internal Server Error', 500],
//     ['Not Implemented', 501],
//     ['Bad Gateway', 502],
//     ['Service Unavailable', 503],
//     ['Gateway Timeout', 504],
//     ['HTTP Version Not Supported', 505],
//     ['Variant Also Negotiates', 506],
//     ['Insufficient Storage', 507],
//     ['Loop Detected', 508],
//     ['Not Extended', 510],
//     ['Network Authentication Required', 511],
// ]);
