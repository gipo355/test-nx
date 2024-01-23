import * as argon2 from 'argon2';

const verifyPassword = async (
  hash: string,
  password: string
): Promise<boolean> => {
  try {
    if (await argon2.verify(hash, password)) {
      // password match
      return true;
    }
    // password did not match
    return false;

    /**
     * ## Unneeded try catch. error is thrown up
     */
  } catch {
    return false;
  }
};

export { verifyPassword };
