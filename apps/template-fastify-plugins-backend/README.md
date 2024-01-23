# GENERIC FASTIFY TEMPLATE FOR API

## notes

for errors use sensible, for succes codes use util file

views are disabled. this is an API template.

if you want to serve static and/or SSG/SSR:

- must set up ejs on globalMiddlewares and create the static + views routes on
  app.ts
- check rendering below

[https://github.com/fastify/fastify/blob/main/docs/Reference/Server.md#inject]

## TODO

### plugins project

debug what is hanging the fe requests with fastify static why no cookies from
oauth callback when redirected to dashboard

- grcp (connect) trcp

- refactor, clean, document, make tests
- isolate plugins with their routes so that the folder can be copy pasted (e.g.
  auth)

- check keyobject, nodejs recommends secrets using keyobject api instead of
  strings
- stripe payments
- aws s3 / imagekit
- complete what's done with schemas, refactor, cleaning. validaton, tests
- use typebox more for validation
- separate UI? do static + spa?
- error handling
- error filtering api + frontend
- api token ( no access token ) for api calls
- no magic numbers (e.g. cookie exp)
- fix caching, was breaking fastify static and study cache headers
- POSSIBLE AUTH METHODS: token in [Auth Bearer, cookie[jwt, session], params]
- study session based auth ( fastify-session, fastify-secure-session ) using
  redis and make template for session auth
- check @auth/sveltekit nextauth
- check lucia for auth too
- make the FE, how does auth work?
- possibly amazon sqs?
- complete plugins with utils
- routes
- auth (jwt, google, github)
- emails
- stripe
- images
- security
- websocket simple imlementation
- logging ( loki grafana and sentry )
- fix docker
- elastic search
- factory funcs in utils
- trpc
- frontend (ssr and static)
- tests
- move magic numbers and other settings in config
- i11y
- svelte static + spa + ssr with svelte/compiler

### done

### others

- refactor to fastify example
- [ ] tRPC ( check t3 stack ) or graphql with mercurius
      [https://trpc.io/docs/server/adapters/fastify] [https://trpc.io/docs]
      [https://daily.dev/blog/building-modern-apis-with-fastify-graphql-and-mongodb]
      [https://github.com/mercurius-js/mercurius]
- [ ] global error handling to prevent leaking info and improve error handling
- [ ] csrf ( see fastify example )
- [ ] monitoring (reqs and server stats)
- [ ] redis caching ready, redis pub/sub
- [ ] all plugins
- [ ] basic prisma scheme 2 relations
- [ ] unit testing and integration testing with testcontainers, vitest and
      fastify inject or supertest
- [ ] auth
- [ ] use ky instead of fetch
- [ ] add stripe
- [ ] separate rendering and api
- [ ] add auth (keyclaok? clerk? passport? fastifyauth?)
- [ ] move to planetscale for psql
- [ ] move to upstash for redis
- [ ] emails ready
- [ ] add fastify vite for vue [https://github.com/fastify/fastify-vite] for ssr
      (renderer <https://github.com/fastify/fastify-dx>)
- [ ] scripts fr dbs
- [ ] make separate ssr and api
- [ ] create prisma + mongo real dbs
- [ ] create uesrs
- [ ] implement auth [https://github.com/fastify/fastify-oauth2] or secure
      session with cookies and redis
- [ ] add missing services like mail from express project
- [ ] encapsulate middlewares ( for auth )

## doing

- decide how to render html ssg (fastify vite vanilla? fastify vite react?
  fastify/view with ejs? simple template literals?) for mails and ssg pages
- implement mails
- implement all user and auth routes
- implement jwt access refresh
- implement sso and google auth

- complete building routes
- make first schema
- switch cruds to prisma
- create the routes from natours
- make a single document mongoose for geospatial or messages example
- auth [https://codevoweb.com/node-prisma-postgresql-access-refresh-tokens/]

## done

- [ ] 1 doc mongo
- [ ] add <https://github.com/sindresorhus/ky-universal>
- [ ] fastify logger in workers
- [ ] multipart form
- [ ] refactor into modules (modules/_.controller.ts_.rotues.ts \*.model.ts)
- add mongoose
- error handling mongoose ( don't wanna send duplicate email error )
- improve error handling, must be handling codes globally, can't do for each
- [ ] add infisical
- [ ] worker pool
- [ ] bullmq
- add mongoose models to fastify
- [ ] add ejs for vue

## FEATURES

add features and explanations

## multi parameter routes

```js
const fastify = Fastify();

fastify.register(
  function (fastify, opts, next) {
    fastify.get('/hello', (req, reply) => {
      reply.send({ id: req.params.id });
    });
    next();
  },
  { prefix: '/v1/:id' }
);
```

## fastify registers strategies

```ts
fastify.register((instance, opts, next) => {
  instance.use(mid1);
  instance.use(mid2);
  instance.register(require('./auth-routes'), opts);
});

fastify.register((instance, opts, next) => {
  instance.register(require('./no-auth-routes'), opts);
});
```

planetscale for psql upstash for kafka and redis zeromq / rabbitmq for brokers

## possible MQs

- rabbitmq
- nats
- redis
- kafka
- memphis

## validation

vinejs ajv typebox zod json schema( built in and recommended )
[https://fastify.dev/docs/latest/Reference/Type-Providers/]
[https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/]
[https://www.nearform.com/blog/upgrading-fastifys-input-validation-to-ajv-version-8/]
[https://fastify.dev/docs/latest/Reference/TypeScript/]
[https://json-schema.org/learn/getting-started-step-by-step.html]

fatify uses json schema compilatio into functions to validate user requests

can add typebox to it

what is ajv? ajv is the default validation compiler for json schema

ajv is a high performance schema validator

do i need to do something for ajv-typebox on fst?
[https://www.reddit.com/r/typescript/comments/113ol65/fastify_support_for_auto_type_inference_similar/]

## rendering

emails must be done with a template engine and sent to que ( or send the whole
html )

client code can be either ssg or served static:

served from api server( monolith ) or separate server or cdn

careful difference ssr and ssg

- ssg with ejs from fastify
- ssg with fastify/vite fastify/next for hydration (like next)
- served with a specific tool (astro, next, nuxt, sveltekit, vite ssr) which
  acts like the ssg server server separated from the api
- built with a framework ( react ) and served as static from view server, api
  monolith or cdn

  [https://github.com/frandiox/vite-ssr#middleware-mode]

```
SSR dtands for Server-Side Rendering and is a rendering strategy that converts your application into HTML on the server.

Some other rendering strategies are:

    CSR - Client-Side Rendering, which renders in the browser.
    SSG - Static Site Generation, which generates the HTML on build (and therefore only fetches data once).
    ISR - Incremental Static Regeneration, which is a combination of SSG and SSR that allows you to create or update static pages after you’ve built your site.
    SSR + CSR hydration

Unlike traditional SPA's (Single Page Application) which use CSR to render their content, SSR gives a faster "time-to-content" and is better for SEO, since crawlers will see the fully rendered page

#1 🏆 Astro - 99,2

#2 SvelteKit - 99

#3 Nuxt 3 & Remix - 98,8

#4 Next.js - 98,6
```

also fastify full stack framework
[<https://github.com/fastify/fastify-dx>][https://github.com/fastify/fastify-dx/tree/main/packages/fastify-react]

jamstack [https://jamstack.wtf/#what-is-jamstack]

```
Hydration, SPAs, and JAMStack are at the top of the list for 2023
```

[https://stackdiary.com/front-end-frameworks/]

## testing

[https://github.com/testjavascript/nodejs-integration-tests-best-practices#section-1-infrastructure-and-database-setup]

### todo

- seed the dbs

## auth

- permit ( for simple api auth )
- passport
- fastiFy plugins (of which simple-oauth wrappe)
- clerk
- firebAse / supabase

argon, jwt(fastify)

## best practices

[https://github.com/practicajs/practica]

[https://github.com/delvedor/fastify-example/blob/main/plugins/authorization.js]

## possible things to do after studying fastify example

use fastify piscina use fastify autoload

organize routes as plugins

plugins can be registered per route

routes can be organized by folder with autoload

encapsulate plugins

register onclose LIFO

shared schemas

how to integrate UI building + ssr ( check fastify example )

## dbs

prisma drizzle postgres.js with zod

## possible linters

standard biome eslint (can even add google, standard-ts eslints)

## bundlers, compilers, runners

- estrella
- esbuild
- tsx
- swc
- tsup
- ts-node
- tsc
- nodemon

[https://www.reddit.com/r/node/comments/11h2zci/is_there_a_better_way_to_do_nodemon_with/]
tsconfig-paths + ts-node using
`node --watch -r ts-node/register -r tsconfig-paths/register app.ts` or
tsc-alias using `tsc && tsc-alias`

## to do fastify example

- on close hooks are LIFO
- scope plugins per route/dir as needed
- move to autoload?
- split plugins per scope ( front - back )

## swagger and schemas

- how to use typebox to define swagger schemas globally and reuse them?
- learn more about plugin encaplsulation ( check fastify example )
- make shared schemas

## requests clients

undici is optimized for request to the same address with new Client ky is good
for interceptors native fetch for simplicity

## useful helmet opts for API

<https://stackoverflow.com/questions/60706823/what-modules-of-helmet-should-i-use-in-my-rest-api>
