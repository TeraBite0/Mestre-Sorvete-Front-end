# Etapa 1: Build do frontend
FROM node:18 AS build

WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o build de produção (os arquivos estáticos, incluindo o CSS, estarão em /app/build)
RUN npm run build

# Etapa 2: Servir com NGINX
FROM nginx:alpine

# Remove a configuração padrão do NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa configuração customizada para o local onde o NGINX espera
# que os arquivos de configuração de hosts virtuais estejam.
# Isso garante que sua configuração seja carregada e não ignorada.
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia os arquivos estáticos gerados pelo build do frontend
# de /app/build (no estágio de build) para /usr/share/nginx/html (no estágio do NGINX)
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o NGINX em modo non-daemon (para manter o container vivo)
CMD ["nginx", "-g", "daemon off;"]