import { sign } from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');
if (!JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN not set');

const signToken = async function signJWT(
  payload: Record<string, string | number>,
  expiresIn: string | number = JWT_EXPIRES_IN
) {
  return new Promise((resolve, reject) => {
    // const token = sign(
    sign(
      payload,
      JWT_SECRET,
      {
        // expiresIn: JWT_EXPIRES_IN,
        expiresIn,
      },
      (err, asyncToken) => {
        if (err) reject(err);
        resolve(asyncToken);
      }
    );
    // resolve(token);
  });
  // console.log(payload, 'payload');

  // const tokenPayload = { ...payload };
  // console.log(tokenPayload, 'tokenpayload');
  // console.log({ id }, 'object');

  // let token: string | undefined;
  // sign(
  //     token,
  //     JWT_SECRET as string,
  //     {
  //         expiresIn: JWT_EXPIRES_IN,
  //     },
  //     (err, asyncToken) => {
  //         if (err) throw err;
  //         debugger;
  //         token = asyncToken;
  //     }
  // );

  // return token;
};

export { signToken };
