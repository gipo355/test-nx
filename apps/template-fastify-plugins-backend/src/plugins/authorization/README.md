# Auth

## Authorization: the most difficult part to grasp

there are many different ways to implement auth can use local auth(email+pw),
oauth2.

oauth2 helpers include fastify-oauth2(simple-oauth), fastify-auth0-verify,
fastify-passport, auth.js, lucia

lucia, authjs and fastify-oauth2 provide helpers to login with oauth2 (authjs
allows jwts) lucia and authjs did a similar implementation to mine authjs
instead of self-made refresh tokens, uses the refresh token from oauth2

- a secure algo lib is libsodium (fastify-secure-session and paseto use it)
- for sessions we have: Lucia, fastify-session, fastify-secure-session, auth.js
- for tokens we can use fastify-jwt, jose, PASETO, auth.js
- we could also use passport.js or better fastify-passport (which uses
  fastify-session or fastify-secure-session)
- or a 3d party service like clerk

examples and links: [https://authjs.dev/guides/basics/refresh-token-rotation]
[https://www.reddit.com/r/SvelteKit/comments/15g7mu9/lucia_auth_any_reasons_not_to_use_it/]
[https://www.youtube.com/watch?v=UMpKaZy0Rpc]

for storing tokens on the client we use cookies to send them we use cookies
[sveltekit proxy: Authorization header or body] (jwts or session) and redis only
over https

everyone recommends sessions for auth JWT is for sending trusted messages both
can coexist

stateless tokens (jwt, secure-session) store the user info in the token stateful
sessions (fastify-session, lucia, authjs) store the user info in the session
store

note: t3 stack uses authjs on the link above with prisma, same fields

stateless tokens need access-refresh token pair. the refresh acts like a session
and is checked against the db it's better for scalability if instead we use a
blacklist instead of a whitelist (clusters may receive updated whitelist late)

the session id will store the user and the role in redis

NOTE: important mentions

on privilege update or important changes, the user must be logged out everywhere
on password change, the user must be logged out everywhere don't accept non
existing sessions fixate the session with User-agent and IP, invalidating the
session if they change

IP and user-agent must be proxied to fastify (and cookies, headers too if
behind 1) on caddy, X-Forwarder-For for IP, either X-Forwarder-For or [req.ip,
req.raw.ip] or sveltekit event.clientAddress for user-agent,
req.headers['user-agent'] or sveltekit event.headers['user-agent']

token should be encrypted(to prevent reading extra data) and signed (to prevent
tampering)
[https://www.reddit.com/r/webdev/comments/6dyzbn/is_a_sessionbased_or_tokenbased_stateless/]
the session ID must be random and unguessable, have high entropy if encrypted,
the algo must be secure on login and logout, clear all expired from db on logout
all all sessions must be invalidated notify user on login from new device
refresh the session after x invalidating the old one (2 expiry types, short and
long + idle)

in this case, we will auth users with oauth2 which will confirm the email
without the need to use passwords and store the session in cookies and redis
sessions must be checked against the db on every request but can be revoked
instantly and are battle tested

encryption and signing are heavy processes, so we will use a worker thread to
handle them

as methods, we will have 1 authenticate middleware hook that will check
onRequest if user is authenticated and provide the info (id, role) and a
authorize(role) hook that will check if the user is allowed with the info
