FROM node:7.10

ENV APP_DIR /usr/src/operam

RUN npm install gulp-cli -g
RUN npm install nightwatch -g
RUN npm link nightwatch

COPY package.json $APP_DIR/package.json
RUN cd $APP_DIR && npm install --quiet

WORKDIR $APP_DIR
COPY ./ $APP_DIR
