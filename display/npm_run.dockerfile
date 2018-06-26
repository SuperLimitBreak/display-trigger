FROM node:9-alpine

WORKDIR /display
#VOLUME /display/node_modules

COPY package.json package.json
RUN npm install && npm cache clean

ENTRYPOINT [ "npm", "run" ]
CMD [ "--help" ]
