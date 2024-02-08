/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/**
 * ## make certs in <root>/dev-certs/
 * openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
 * openssl rsa -in keytmp.pem -out key.pem
 */
import { readFileSync } from 'node:fs';

import { IS_HTTPS_ENABLED } from '../config';
import { Logger } from '../loggers';

const key = IS_HTTPS_ENABLED && readFileSync('../../dev-certs/key.pem', 'utf8');

const cert =
  IS_HTTPS_ENABLED && readFileSync('../../dev-certs/cert.pem', 'utf8');

// TODO: better error handling
if (IS_HTTPS_ENABLED && (!key || !cert)) {
  Logger.error(
    'certs not found: install them in <project>/dev-certs/ with\nopenssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365\nopenssl rsa -in keytmp.pem -out key.pem\n'
  );
}
export { cert, key };
