import { getContext, setContext } from 'svelte';

/**
 * The context object.
 */
interface Context<T> {
  get: () => T;
  set: (context: T) => T;
}

// function randomContextName() {
//   return `$$context_${crypto.randomUUID()}`;
// }

/**
 * Creates a context.
 */
export function createContext<T>(
  key: symbol | string = Symbol('context')
): Context<T> {
  return {
    get: () => getContext<T>(key),
    set: (context: T) => setContext(key, context),
  };
}
