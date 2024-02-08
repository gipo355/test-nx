import { SALT_WORK_FACTOR, WORKER_POOL_ENABLED } from '../config';
import { poolProxy } from '../workers';
import { encryptPassword } from './crypto';

export const autoEncryptPassword = async (password: string) => {
  const result = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.encryptPasswordWorker(password, SALT_WORK_FACTOR)
    : encryptPassword(password, SALT_WORK_FACTOR));
  return result;
};
