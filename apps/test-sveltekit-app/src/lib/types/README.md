<!--toc:start-->

- [automatic fast-json-stringify and ajv validators](#automatic-fast-json-stringify-and-ajv-validators)
  - [how](#how)
  - [the compile functions are run automatically on build and dev](#the-compile-functions-are-run-automatically-on-build-and-dev)
  - [validators](#validators)
  - [serializers](#serializers)
  <!--toc:end-->

# automatic fast-json-stringify and ajv validators

automatic fast-json-stringify and ajv validators are created for every file in
this directory that exports a variable with Schema in its name.

you can then import them from `lib/validators` or `lib/serializers`

## how

recommended Typebox

- create any file in `lib/types` which exports a JsonSchema object with Schema
  in its name (use Typebox) (e.g.
  `export const TNameSchema = Typebox.object({...})`)
- export its type as `TName` (e.g.
  `export type TName = Static<typeof TNameSchema>`)

## the compile functions are run automatically on build and dev

## validators

the validators are named the same as the schema

recommended `import * as validators from 'lib/validators'` then you can access
them with `validators[SchemaName]`

## serializers

the serializers are named `stringify{SchemaName}`

recommended `import * as serializers from 'lib/serializers'` then you can access
them with `serializers['stringify{SchemaName}']`
