# use node.js lts as base image
FROM node:20.0.0-alpine

RUN npm install -g pnpm

# set working directory
WORKDIR /app

# copy package.json and package-lock.json and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# copy the rest of the application code
COPY . .

# build the application
RUN pnpm build

# expose the port the app runs on
EXPOSE 8000

# start the application
CMD ["pnpm", "run", "start:prod"]