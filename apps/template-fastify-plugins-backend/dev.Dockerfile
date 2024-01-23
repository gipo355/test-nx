# multi-stage build here? no in prod.Dockerfile ( don't ship dev deps and .env )
# FROM node:20.5-bullseye as BUILD_IMAGE
FROM node:20.5-alpine3.17 as BUILD_IMAGE

LABEL org.opencontainers.image.source https://github.com/gipo355/template-fastify



# initialize for overriding
ENV INFISICAL_TOKEN=''

# change default passwords for security ( prevent privesc if compromised )
# set and .env file in the same path or pass env vars
# ARG DOC_ROOT_PW
# ARG DOC_NODE_PW
# ENV DOC_ROOT_PW ${DOC_ROOT_PW}
# ENV DOC_NODE_PW ${DOC_NODE_PW}
# RUN echo 'root:asdf33415693#<{%345<>{asdf5645`rirolae}}' | chpasswd
# RUN echo 'node:92349sdak6<>}kj3kase4lsk3365asdfk3lkkl6^' | chpasswd
# RUN echo "root:$(DOC_ROOT_PW)" | chpasswd
# RUN echo "node:$(DOC_NODE_PW)" | chpasswd

# root dir - OLD
# WORKDIR /app

# create new user with home folder
# RUN useradd -m docker

# add infisical for secrets
# RUN apt-get update && apt-get install -y bash curl && curl -1sLf \
#     'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
#     && apt-get update && apt-get install -y infisical

# node-gyp dependencies

# alpine
# needed for node-gyp (argon2)
RUN apk add --no-cache python3 make g++ curl
# RUN apk update && apk add python make g++ gcc
# RUN apk update && apk add python make g++ gcc && rm -rf /var/cache/apk/*
# RUN apk add python make gcc g++

# RUN apt update && apt intall python make gcc g++ -y

# Add libvips for sharp
RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/


# create home dir for node built in user (doesn't work in alpine)
# RUN mkhomedir_helper node

RUN mkdir -p /home/node/app
RUN chown -Rh node:node /home/node/


# set user as default
# USER docker
# NODE USER IS BUILT IN BUT NO HOME
USER node
WORKDIR /home/node

# RUN mkdir /home/docker/app

# place global dependencies in non root folder for security
# DOESN'T WORK. pnpm is under /usr/local/bin
# npm under /usr/local/bin
# global packages under /usr/local/bin
RUN mkdir -p /home/node/.npm-global/bin
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin
# make sure node env is set
ENV NODE_ENV=development



# install config pnpm ( could specify version )
RUN npm i -g pnpm
# USER root
# RUN corepack enable
# USER node
# RUN corepack prepare pnpm@latest --activate
# RUN pnpm --version;
# RUN pnpm setup;
# RUN pnpm store path;
# RUN corepack prepare pnpm@latest --activate

# RUN npm i -g pm2
# RUN pm2 install pm2-logrotate

# needed for node-gyp (argon2)
RUN npm i -g node-gyp


# set global store
# RUN pnpm config set store-dir /home/docker/.pnpm-store
RUN mkdir -p /home/node/.local/share/pnpm/store
# RUN pnpm setup

# alternative pnpm install
# RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

RUN pnpm config set store-dir /home/node/.local/share/pnpm/store/
# RUN pnpm config set global-dir /home/node/.local/share/pnpm

# using pnpm guide for docker
# pnpm fetch does require only lockfile
# COPY pnpm-lock.yaml /home/node/app/
# RUN pnpm fetch --prod
# RUN pnpm fetch
# ADD . ./
# COPY . ./
# RUN pnpm install -w --offline --prod
# RUN pnpm install -w --offline
# RUN pnpm install -w
# RUN pnpm install -r --offline --prod
# RUN pnpm install -r --offline


# copy and install deps for caching
# COPY package*.json ./
# COPY pnpm*.yaml ./
# COPY .npmrc ./

# install root then project specific
# RUN pnpm install -w
# RUN pnpm install -r
# RUN pnpm install -w --frozen-lockfile
# RUN pnpm install -r --frozen-lockfile
# RUN npm i

# copy the rest, ignore node modules from .dockerignore
# COPY . /home/docker/app/
# COPY . /home/node/app/
# COPY . /home/node/app/
ADD . /home/node/app/

# set default workdir for running the app
# WORKDIR /home/docker/app
WORKDIR /home/node/app


# RUN pnpm install -w --offline
# RUN pnpm install -r --frozen-lockfile
# RUN pnpm install -w --offline --frozen-lockfile
# RUN pnpm install --prefer-offline --frozen-lockfile
RUN pnpm install


RUN pnpm db:generate


# EXPOSE 8080
# EXPOSE 3000
# EXPOSE 3000

# CMD [ "pm2", "start", "--attach", "./infisical-run.sh" ]
# CMD [ "infisical", "run", "--", "pm2", "start", "ecosystem.config.js" ]
# CMD ["node", "main.js"]
# CMD ["tsc", "-w", "src/main.ts"]

# CMD ["pnpm", "run" ,"dockerdev"]

# for prod, install only prod deps (purge devdeps after build) and purge node modules with
# RUN curl -sf https://gobinaries.com/tj/node-prune | sh
# RUN npm prune --production --no-optional or delete node modules and run pnpm install --prod or pnpm deploy


## MULTI STAGE

FROM node:20.5-alpine3.17
# FROM node:20.5-bullseye

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_ENV=development
ENV INFISICAL_TOKEN=''

RUN mkdir -p /home/node/app
RUN mkdir -p /home/node/.npm-global
RUN mkdir -p /home/node/.local/share/pnpm/store

COPY --from=BUILD_IMAGE /home/node/.npm-global /home/node/.npm-global
COPY --from=BUILD_IMAGE /home/node/app /home/node/app
# COPY --from=BUILD_IMAGE /home/node/.local/share/pnpm/ /home/node/.local/share/pnpm/

RUN chown -R node:node /home/node/

USER node

WORKDIR /home/node/app

# RUN corepack enable
# USER node
# RUN corepack prepare pnpm@latest --activate
# RUN npm i -g pnpm

# copy from build image
# COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
# COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "run" ,"dockerdev"]
