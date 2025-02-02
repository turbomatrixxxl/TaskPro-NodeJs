
# Setam ce imagine si ce versiunea de node.js o sa foloseasca contrainerul meu 
FROM node:18

# Setam pe ce folder sa lucreze 
WORKDIR /usr/src/server

# Copiem pachetul de dependinte si fisierele de configurare
COPY package*.json ./

# Instalam dependentele
RUN npm install

# Copiem restul aplicatiei
COPY . .

# Definim portul pe care in expunem port 5000
EXPOSE 7000

# Comanda pentru a rula aplicatia 
CMD ["npm", "start"]
