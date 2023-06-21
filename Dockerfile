FROM node:16
# Create app directory
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . /usr/src/app/
EXPOSE 8080
CMD [ "node", "server.js" ]