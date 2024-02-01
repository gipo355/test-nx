/* eslint-disable import/no-mutable-exports */
// eslint-disable-next-line spellcheck/spell-checker
/**
 * ## make certs
 * openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
 * openssl rsa -in keytmp.pem -out key.pem
 */
/* eslint-disable node/no-sync */
import { readFile } from 'node:fs/promises';

import { IS_HTTPS_ENABLED } from '../config';
import { Logger } from '../loggers';

const key = IS_HTTPS_ENABLED && (await readFile('./certs/key.pem', 'utf8'));

const cert = IS_HTTPS_ENABLED && (await readFile('./certs/cert.pem', 'utf8'));

// TODO: better error handling
if (IS_HTTPS_ENABLED && (!key || !cert)) {
  // eslint-disable-next-line spellcheck/spell-checker
  Logger.error(
    'certs not found: install them in <project>/dev-certs/ with\nopenssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365\nopenssl rsa -in keytmp.pem -out key.pem\n'
  );
}
export { cert, key };
