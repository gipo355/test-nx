import path from 'node:path';

/**
 * return absolute path to file
 *
 * @param relativePrefix - jumps from where you are. (e.g. './', '../')
 * @param fileName - file name
 * @returns a string with the absolute file path
 */
export const generatePathToFile = function getPathToFile(
  relativePrefix: string
  // fileName: string
) {
  // return path.resolve(__dirname, `${relativePrefix}`, `${fileName}`);
  return function compositedFileName(fileName: string) {
    // eslint-disable-next-line unicorn/prefer-module
    return path.resolve(__dirname, `${relativePrefix}`, `${fileName}`);
  };
};
