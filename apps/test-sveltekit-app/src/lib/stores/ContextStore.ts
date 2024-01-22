import { type Static, Type } from '@sinclair/typebox';
import type { Writable } from 'svelte/store';

import { createContext } from '../utils/context';

export const ContextSchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
});

export type Context = Static<typeof ContextSchema>;

// this doesn't set a context, it only prepares its types
export const ContextStore = createContext<Writable<Context>>(Symbol('context'));
