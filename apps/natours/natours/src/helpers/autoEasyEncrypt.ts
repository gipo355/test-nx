import { WORKER_POOL_ENABLED } from '../config';
import { poolProxy } from '../workers';
import { easyEncrypt } from './crypto';

const autoEasyEncrypt = async function autoEasyEncrypt(token: string) {
  const encryptedToken = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.easyEncryptWorker(token)
    : easyEncrypt(token));
  return encryptedToken;
};

export { autoEasyEncrypt };
