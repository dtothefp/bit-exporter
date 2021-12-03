FROM node:16-alpine

USER root

ENV PATH=$PATH:/root/bin
ENV NODE_OPTIONS=--max_old_space_size=4096

RUN apk update && \
    apk upgrade && \
    apk --no-cache add git

RUN npm i @teambit/bvm -g
RUN bvm install
RUN bit config set analytics_reporting false
RUN bit config set no_warnings false
RUN bit config set interactive false
RUN bit config set error_reporting true
