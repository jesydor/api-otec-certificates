# Start from the node image v12
FROM node:18.15.0

# Change the work directory app
WORKDIR /src

RUN apt-get update
RUN apt-get install -y software-properties-common apt-transport-https ca-certificates curl
RUN npx puppeteer browsers install chrome


# Copy the package dependencies
COPY ./package.json .
COPY ./package-lock.json .

# Install dependencies
RUN npm install

# Copy the directory
COPY . .

# Compile files in the dist folder
RUN npm run compile

# Expose the port 3000
EXPOSE 3000

# Run the server
CMD ["npm","run","start"]
