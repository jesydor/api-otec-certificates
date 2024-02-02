# Utiliza la imagen de Puppeteer, que ya incluye Chrome
FROM buildkite/puppeteer:18.0.0

# Establece el directorio de trabajo en /src
WORKDIR /src

# Copia los archivos de la aplicación
COPY . .

# Instala las dependencias
RUN npm install

# Compila los archivos en la carpeta dist
RUN npm run compile

# Expone el puerto 3000
EXPOSE 3000

# Ejecuta el servidor
CMD ["npm", "run", "start"]
