FROM --platform=amd64 node:20
# to work in mac
# FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json (o yarn.lock) al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Comando para construir la aplicaci  n de React (esto puede variar seg  n tu proyecto)
EXPOSE 3000

# Comando para ejecutar npm run build
RUN ["npm", "run", "build"]

# Comando para ejecutar el servidor de producci  n
CMD ["npm", "run", "start"]