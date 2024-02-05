# Start from the node image v12
FROM node:18.15.0

# Change the work directory app
WORKDIR /src

# Install required dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-l10n \
    libgbm1 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgtk-3-0 \
    libnss3 \
    libpangocairo-1.0-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libdbus-1-3 \
    libsecret-1-0 \
    libudev1 \
    xdg-utils

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
