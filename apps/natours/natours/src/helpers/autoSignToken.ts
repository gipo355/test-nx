import { WORKER_POOL_ENABLED } from '../config';
import { poolProxy } from '../workers';
import { signToken } from './signToken';

export const autoSignToken = async (
  payload: Record<string, string | number>,
  expiresIn?: string | number
) => {
  const token = await (WORKER_POOL_ENABLED === '1'
    ? poolProxy.signTokenWorker(payload, expiresIn)
    : signToken(payload, expiresIn));
  return token;
};
