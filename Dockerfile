FROM node:14 as build

COPY package.json yarn.lock /tmp/genetics-app/
WORKDIR /tmp/genetics-app/

RUN yarn
COPY . /tmp/genetics-app/
RUN yarn build
CMD yarn build:serve