# Validators

there are 3 main types:

- Dynamic
- JIT just in time
- AOT ahead of time

Dynamic is a huge performance hit on the whole app since it performs lookups on
a case by case basis. [e.g. zod, valibot, typebox-dynamic, ...others]

JIT is the best compromise since it compiles to performant strings that need to
converted to functions on app start and get cached. We can't use JIT in the
browser since it uses `eval` or `new Function` which is not permitted by CSP
unless `unsafe-inline` is allowed. It's also not the best for browser as it will
be bad for memory. Good to use server side (e.g. fastify uses ajv compilation on
startup and caches the functions) [e.g. typebox, ajv compile]

AOT needs to compile before running the app, will provide performant functions
to validate the schemas defined [e.g. typebox-aot with typecompiler, typia, ajv
standalone]

Ajv allows formats and is fast enough.

I will then use:

- typebox for JSON schemas and types inference system wide
- Ajv to compile the validators from typebox and verify user input and api

## Use JSON Schema

# Flow

1. Add typebox schemas and types and export them for the app.
2. Add the schemas to the AJV script ( add to schemas file )
3. compile the functions (automated on dev and build runs)
4. import the compiled schema `todo`, from the built file, assign it to a func
   `validateTodo` and cast the provided type `TAjvValidationFunction`
