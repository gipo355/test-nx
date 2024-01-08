import { type Static, Type } from '@sinclair/typebox';

// template file
export const todoSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    completed: Type.Boolean(),
  }
  // {
  //   $id: 'todo',
  //   $schema: 'http://json-schema.org/draft-07/schema#',
  // }
);
export type TTodo = Static<typeof todoSchema>;
export const todosSchema = Type.Array(todoSchema);
