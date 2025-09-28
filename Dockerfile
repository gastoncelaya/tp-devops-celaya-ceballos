# dependencias (builder)
FROM node:20-alpine AS deps
WORKDIR /app
# 1) solo los manifests para aprovechar la cache de Docker
COPY package*.json ./

# 2) dependencias exactas 
RUN npm install

# runtime mínimo
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
# copia solo lo necesario desde deps
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY ./src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]