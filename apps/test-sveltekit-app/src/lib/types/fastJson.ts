import fastJson from 'fast-json-stringify';

export const stringifyExample = fastJson({
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    age: {
      description: 'Age in years',
      type: 'integer',
    },
    reg: {
      type: 'string',
    },
  },
});
