# Create app and work directory
FROM node:16
WORKDIR /vylbot

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Bundle app source
COPY . .
RUN yarn build

# Run the app source
CMD [ "yarn", "start" ]