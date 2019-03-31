FROM node:9.6.1

ADD . /usr/src/app/
WORKDIR /usr/src/app
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent

CMD ["npm", "start"]