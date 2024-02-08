import type { NextFunction, Request, Response } from 'express';

// Module augmentation typescript
// allow adding props to the req through middleware
// declare module 'express' {
//     interface Request {
//         user?: {
//             password: string;
//             _id: string;
//             name: string;
//             email: string;
//             passowrdLastModified: Date;
//             role: string;
//         };
//     }
// }
// ! most difficult concept to grasp, having a single catch point for all handlers using composing ( currying? )
export const catchAsync = function catchAsync(
  routeHandlerFunction: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) {
  // we need to return the same function here to avoid calling it on assignment
  return function returnedFunction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    routeHandlerFunction(req, res, next).catch(next);
  };
};

// catchAsync(async function returnedFunction(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: {
//         name: 'The Forest Hiker',
//       },
//     },
//   });
// });

/**
 * ## catchAsync(callback(req,res,next)) will return function(req, res, next) {callBack(req,res,next)} but not execute it yet
 * and execute the callback(req,res,next).catch(next) when called
 * the calback is passed the arguments req, res, next down to the execution by automatically populating the callback in the middleware
 * the catch(error){ next(error) } will be executed when called if there is an error
 *
 * function(callback(params))
 * returns function(params) => callback(params)
 * executes callback(params).catch(next)
 */
