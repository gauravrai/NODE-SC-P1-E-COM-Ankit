FROM node:16.15-alpine
WORKDIR /app

# Copy and download dependencies
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Copy the source files into the image
COPY . .
EXPOSE 4000
# yarn start (this is manual process I have run with node app.js)
CMD node app.js