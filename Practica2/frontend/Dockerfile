#base image
FROM node:12-alpine

WORKDIR /usr/src/app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# install and cache app dependencies
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

CMD ["npm", "start" ]