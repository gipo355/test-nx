import type { TAjvValidateFunction } from '$lib/types/ajv';

// use ajv
export const validateAjv = (
  validator: TAjvValidateFunction,
  data: unknown
): boolean => {
  const valid = validator(data);

  if (validator.errors !== null && validator.errors !== undefined) {
    //   const messages = ((validator.errors ?? []) as TAjvError[])
    //     .map((error_) => error_.message)
    //     .join('\n');

    const messages = validator.errors
      .map((error_) => {
        const { message, instancePath, keyword } = error_;

        const property = instancePath.split('/').at(-1);

        return `${keyword} error: ${property} ${message}`;
      })
      .join('\n');

    // console.log(validator.errors);
    throw new Error(messages);
  }
  return valid;
};
// validateTodo(newTodo);

// if (validateTodo.errors !== null) {
//   const ajvErros = (validateTodo.errors ?? []) as TAjvError[];
//   if (ajvErros.length === 0) throw new Error('Invalid todo');
//   const messages = ajvErros.map((error_) => error_.message).join('\n');
//   throw new Error(messages);
// }
