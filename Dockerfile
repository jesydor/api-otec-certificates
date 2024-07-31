# Start from the node image v12
FROM node:latest

# Change the work directory app
WORKDIR /src

# Install dependencies
RUN apt-get update && apt-get install -y wget gnupg
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y chromium

# Install puppeteer
RUN npx puppeteer@latest install

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
CMD ["npm", "run", "start"]
