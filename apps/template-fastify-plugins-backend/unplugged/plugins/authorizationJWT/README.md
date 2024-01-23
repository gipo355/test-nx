# Auth flow with things like next, sveltekit, nuxt

implement auth for sveltekit

[https://www.youtube.com/watch?v=50BYTzwC14Y]

## steps

1. sveltekit server has /login
2. login with github points to either sveltekit oauth and extracts the info or
   directly to the be to extract the info ( i'd prefer be )
3. be should create/update user, generate refresh token, save to db, send the
   refresh token in the `Authorization: Bearer <token>` header ( or body? )
4. frontend gets the refresh token with the user info, creates access token
5. fe sends created access token and refresh token as cookies
6. fe checks for access token only when protecting. access token has 2 min
   expiry.
7. if no access token, expired or invalid, check if refresh token
8. if refresh token, sends to be to /refresh. be validates refresh token, sends
   back new refresh and user info. repeat from step 4. if not ok, reply
   unauthorized. fe clears cookies and redirects to /login
9. if no refresh token, clear and redirects to /login

## problems

1. the api on the be requires the jwt to accept giving data to FE and programs.
   how to handle

2. fe when making calls to API, must send access token or refresh? how to handle

3. how to handle expiry for api calls from programs that require longer expiry
