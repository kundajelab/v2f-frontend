FROM node:14 as build

COPY package.json yarn.lock /tmp/genetics-app/
WORKDIR /tmp/genetics-app/

RUN yarn
COPY . /tmp/genetics-app/

ARG REACT_APP_BE_DOMAIN
ARG REACT_APP_BE_PORT
ARG REACT_APP_FE_DOMAIN
RUN yarn build
CMD yarn build:serve