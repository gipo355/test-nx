import { worker } from 'workerpool';

import { hashPassword } from './hashPassword.js';
import { renderEmail } from './rendering.js';
import { sayHello } from './sayHello.js';
import { testFibonacci } from './testFibonacci.js';
import { verifyPassword } from './verifyPassword.js';

export interface Jobs {
  testFibonacci: typeof testFibonacci;
  sayHello: typeof sayHello;
  verifyPassword: typeof verifyPassword;
  hashPassword: typeof hashPassword;
  renderEmail: typeof renderEmail;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

worker({
  testFibonacci,
  sayHello,
  verifyPassword,
  hashPassword,
  renderEmail,
});
