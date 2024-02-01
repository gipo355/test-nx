# This is Natours API project

we need this readme for typedoc else it will read the project root readme

natours project: todo things

- set env variables
- set config file
- modify pathToRoot and tsconfig extend manually
- decide if worker pool and bullmq pools are enabled
- decide if typedoc and status monitor are enabled
- status monitor uses socket.io ( possible conflicts with other sockets if used
  )
- decide if swagger server is enabled
- generate the docs from script to create typedoc and swagger json outputs
- add all routes and jsdoc comments for auto generation ( auto on prod build )
- eventually add grafana
- enable disable compression from express if nginx compression not present
- the readme is used by typedoc as introduction on index.html
- redis and mongo instances needed
- make sure routes are protected and restricted

# features

- password validation
- password reset
- sign up
- login
- jwt
- email sending
- stripe payments
- mongoose queries
- rate limiter with redis
- static files
- compression
- security
- cors
- mongo sanitization
- xss
- http headers
- pug
- mvc
- error handling
- logging
- worker pools
- bullmq message broker with redis

- mongoose virtuals
- mongoose indexes
- mongoose pre and post hooks
- mongoose aggregation
- mongoose statics
- mongoose methods
- mongoose validation
