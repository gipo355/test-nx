import { WORKER_POOL_ENABLED } from '../config';
import { poolProxy } from '../workers';
import { comparePassword } from './crypto';

export const autoComparePassword: (
  candidatePassword: string,
  hash: string
) => Promise<boolean> = async (candidatePassword: string, hash: string) => {
  const isValid: boolean = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.comparePasswordWorker(candidatePassword, hash)
    : comparePassword(candidatePassword, hash));
  // if (!isValid) return next(new Error('password not valid'));
  return isValid;
};
