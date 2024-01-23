# basic architecture

- example.com landing static with signin button redirects to -> app
- app.example.com app -> hosts svelte
- api.example.com api -> hosts fastify api

they could all be joined if i go monolith

- example.com serve static ( must be same server )
- example.com/app/login or example.com/login
- example.com/app/dashboard or example.com/dashboard
- example.com/api/v1/route

assets can be served from same server(monolith or frontend) or a cdn

# auth flow

on page / sign in button will point to /login page. Login page will have button
triggering route /api/v1/auth/github

this will trigger the oauth2 flow which will respond to
/api/v1/auth/github/callback with a provider access token valid for 1 year. this
token can be revoked

this callback will get user info with provider access token, create(or update)
user while storing the provider access token in db and generate a refresh +
access token. refresh valid for 1 month, acces 5 mins

the refresh route fetches the db to check refresh token validity. it needs to
get the user ( we save access token to db ). it will provide csrf token + access
token new refresh token invalidating the refersh token used

it will then redirect to the app (app.example.com). here it will check for
access token cookie, if not exists call refresh to generate one new. if refresh
token not exists, redirect back to login asks for login

i want to get the user info from the token and create new user if doesn't exist

i also want to save info in a jwt to avoid calling db on every auth request

there will be access cookie and jwt cookie

- the access token needs all the info to satisfy auth ( role, userID ) and must
  be short expiration (2-5 mins)
- the refresh token only needs the info to generate a new access token and can
  last longer (1w-1M)
- the github access token has an expiration of 1 year

the refresh token needs to be deleted and recreated after use

if access token is not valid, we send request to /api/v1/auth/refresh with the
refresh token, which will respond with a csrf
