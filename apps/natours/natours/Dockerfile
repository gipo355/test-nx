FROM node:20.5-bullseye

LABEL org.opencontainers.image.source https://github.com/gipo355/natours

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


# create home dir for node built in user
RUN mkhomedir_helper node

# set user as default
# USER docker
# NODE USER IS BUILT IN BUT NO HOME
USER node

# RUN mkdir /home/docker/app
RUN mkdir /home/node/app

# place global dependencies in non root folder for security
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# make sure node env is production
ENV NODE_ENV=production

# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin

# set default workdir,
# WORKDIR /home/docker/app
WORKDIR /home/node/app

# install config pnpm ( could specify version )
# RUN npm i -g pnpm
USER root
RUN corepack enable
USER node
RUN corepack prepare pnpm@8.5.0 --activate
# RUN pnpm --version;
# RUN pnpm setup;
# RUN pnpm store path;
# RUN corepack prepare pnpm@latest --activate

RUN npm i -g pm2

RUN pm2 install pm2-logrotate

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
COPY pnpm-lock.yaml /home/node/app/
# RUN pnpm fetch --prod
RUN pnpm fetch
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
USER root
RUN chown -Rh node:node /home/node/app
USER node
# RUN pnpm install -w --offline
# RUN pnpm install -r --frozen-lockfile
# RUN pnpm install -w --offline --frozen-lockfile
RUN pnpm install -r -P

# EXPOSE 8080
EXPOSE 8000
# EXPOSE 3000

# CMD [ "pm2", "start", "--attach", "./infisical-run.sh" ]
# CMD [ "infisical", "run", "--", "pm2", "start", "ecosystem.config.js" ]
CMD ["node", "main.js"]
