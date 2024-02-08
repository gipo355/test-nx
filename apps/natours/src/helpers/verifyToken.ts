import { verify } from 'jsonwebtoken';

import { WORKER_POOL_ENABLED } from '../config';
import { poolProxy } from '../workers';
import { AppError } from './AppError';

const { JWT_SECRET } = process.env;

/**
 * validate jwt token with its verify function
 *
 * @param token - input token
 * @throws {AppError} - invalid token errro
 * @returns payLoad object of the token
 */
export const verifyToken: (token: string) => Promise<any> =
  async function signJWT(token: string) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      verify(token, JWT_SECRET!, {}, (err, decoded) => {
        // if (err) throw err;
        if (err) {
          const errMessage =
            err.message === 'jwt expired'
              ? 'Session expired, please login again.'
              : err.message === 'invalid signature'
              ? 'invalid token, please login or signup'
              : 'Something went wrong. Please login or signup';

          reject(new AppError(errMessage, 401));
        }
        if (decoded) resolve(decoded);
      });
    });
    // console.log(payload, 'payload');

    // const tokenPayload = { ...payloads };
    // console.log(tokenPayload, 'tokenpayload');
    // console.log({ id }, 'object');

    // let decodedPayload: string | JwtPayload = {};
    // verify(token, JWT_SECRET as string, {}, (err, decoded) => {
    //     // if (err) throw err;
    //     if (err) throw new AppError('invalid token', 401);
    //     if (decoded) decodedPayload = decoded;
    // });

    // return decodedPayload;
  };

export const autoVerifyToken = async function autoVerifyToken(payload: string) {
  const token = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.verifyTokenWorker(payload)
    : verifyToken(payload));
  return token;
};
// export { autoVerifyToken, verifyToken };
