import { CSRF_ENABLED, JWT_COOKIE_OPTIONS } from '../config';
import { autoSignToken } from './autoSignToken';
import { generateToken } from './csrfProtection';

/**
 * Create and send token
 * @description
 * the user is optional, if we don't want to send the user data don't pass it
 * and it will not send the data in the response
 *
 * @async
 * @sideEffect sends response, sets cookie
 * @param object.dataToSend - optional data to send data object in response
 * @param object.message - optional message to send, defaults to 'success'
 * @param object.payload - payload to sign the token with
 * @param object.statusCode - optional status code to send, defaults to 200
 * @param object.setCookie - optional boolean to set cookie, defaults to false
 * @param object.sendToken - optional boolean to send token, defaults to true
 * @param object.res - response object
 * @param object.req - option request object, needed only if i want to generate CSRF and send in body. Sets cookie
 */
const createSendToken = async ({
  dataToSend,
  payload,
  statusCode = 200,
  message = 'success',
  setCookie = true,
  sendToken = false,
  res,
  req,
  realMessage,
}: /** @description optional data to send data object in response */
{
  dataToSend?: any;
  /** @description payload to sign the token with */
  payload: Record<string, string | number>;
  /** @description optional status code to send, defaults to 200 */
  statusCode?: number;
  /** @description optional message to send, defaults to 'success' */
  message?: string;
  /** @description optional boolean to set cookie, defaults to false */
  setCookie?: boolean;
  /** @description optional boolean to send token, defaults to true */
  sendToken?: boolean;
  /** @description response object */
  res: any;
  /** @description option request object, needed only if i want to generate CSRF and send in body. Sets cookie */
  req?: any;
  realMessage?: string;
}) => {
  const token = await autoSignToken(payload);

  let csrfToken;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (CSRF_ENABLED && req) {
    csrfToken = generateToken(res, req);
  }

  if (setCookie) {
    // IMP: CAREFUL, COOKIES ARE VULNERABLE TO CSRF ATTACKS
    res.cookie('jwt', token, JWT_COOKIE_OPTIONS);
  }

  res.status(statusCode).json({
    status: message,
    ...(sendToken && { token }),
    ...(dataToSend && { data: dataToSend }),
    ...(csrfToken && { 'x-csrf-token': csrfToken }),
    ...(realMessage && { message: realMessage }),
  });
};

export { createSendToken };
