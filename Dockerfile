# Use the official Ubuntu 20.04 image
FROM ubuntu:20.04

# Set non-interactive mode
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install Google Chrome
RUN apt-get install -y chromium-browser 
RUN apt-get install -y libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 
# Change the work directory to /src
WORKDIR /src

# Copy the package dependencies
COPY ./package.json .
COPY ./package-lock.json .

# Install npm dependencies
RUN npm install
RUN npx puppeteer browsers install chrome

# Copy the rest of the application
COPY . .

# Compile files in the dist folder
RUN npm run compile

# Expose port 3000
EXPOSE 3000

# Run the server
CMD ["npm", "run", "start"]
