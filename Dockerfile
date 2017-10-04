FROM node:8-alpine

RUN apk update && apk upgrade
#using yarn
RUN apk add yarn

RUN mkdir /opt/isdustinscarworking
WORKDIR /opt/isdustinscarworking

ADD package.json /opt/isdustinscarworking/
ADD yarn.lock /opt/isdustinscarworking/

RUN yarn install
# VOLUME /opt/isdustinscarworking