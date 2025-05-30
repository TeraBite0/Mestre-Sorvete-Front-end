# Etapa 1: Build do frontend
FROM node:18 AS build

WORKDIR /app

# Copia o package.json e package-lock.json
COPY senhor-sorvete/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY senhor-sorvete/ ./

# Gera o build de produção
RUN npm run build

# Etapa 2: Servir com NGINX
FROM nginx:alpine

# Remove a configuração padrão do NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa configuração customizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copia os arquivos estáticos gerados pelo build
COPY --from=build /app/build /usr/share/nginx/html


# Expõe a porta 80
EXPOSE 80

# Inicia o NGINX
CMD ["nginx", "-g", "daemon off;"]
