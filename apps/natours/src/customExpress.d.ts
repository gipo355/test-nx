declare namespace Express {
  export interface Request {
    /**
     * @description
     * Mongoose Review Query passed
     */
    user?: Record<string, any>;
    /**
     * @description
     * Mongoose Review Query passed
     */
    documents?: any;
    resizedImages?: any;
  }
}

/**
 * ## AUGMENT HTTP REQUEST TO INCLUDE RAWBODY
 * needed for stripe webhooks
 */
declare module 'http' {
  export interface IncomingMessage {
    rawBody: any;
  }
}
