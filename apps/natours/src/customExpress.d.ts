import { Model } from 'mongoose';

declare namespace Express {
  export interface Request {
    // TODO: create the schemas
    /**
     * @description
     * Mongoose Review Query passed
     */
    user?: Record<string, any>;
    /**
     * @description
     * Mongoose Review Query passed
     */
    documents?: Record<string, Model>;
    // resizedImages?: any;

    // _remoteAddress?: string;
  }
}

/**
 * ## AUGMENT HTTP REQUEST TO INCLUDE RAWBODY
 * needed for stripe webhooks
 */
declare module 'http' {
  export interface IncomingMessage {
    rawBody: Buffer;
  }
}
