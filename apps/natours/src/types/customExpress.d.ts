import { Model } from 'mongoose';

// import { Booking, Tour, User } from '../models';

declare namespace Express {
  export interface Request {
    // TODO: create the schemas
    originalUrl: string;
    /**
     * @description
     * Mongoose Review Query passed
     */
    user?: Record<string, number | string>;
    /**
     * @description
     * Mongoose Review Query passed
     */
    documents?: Record<string, Model>;
    // resizedImages?: any;

    requestTime: Date;

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
