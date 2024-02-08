/* eslint-disable security/detect-object-injection */
interface FilterObjectArguments {
  toFilter: Record<string, number | string>;
  wantedKeys: string[];
}
/**
 * function to filter an object with only the wanted keys, we don't want to pass the entire object but only the chosen fields
 *
 * @param {[TODO:type]} [TODO:name].toFilter - [TODO:description]
 * @param {[TODO:type]} [TODO:name].wantedKeys - [TODO:description]
 * @returns [TODO:description]
 */
export const filterObject = function filterObject({
  toFilter,
  wantedKeys,
}: FilterObjectArguments) {
  /**
   * ## this reduce will create a single object with all the keys we want
   */
  // eslint-disable-next-line unicorn/no-array-reduce
  return wantedKeys.reduce((accumulator, current) => {
    if (toFilter[current])
      // eslint-disable-next-line no-param-reassign
      (accumulator as Record<string, string | number>)[current] =
        toFilter[current];
    return accumulator;
  }, {});
};
