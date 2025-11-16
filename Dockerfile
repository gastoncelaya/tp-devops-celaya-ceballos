# dependencias (builder)
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
# 1) solo los manifests para aprovechar la cache de Docker
COPY package*.json ./

# 2) dependencias exactas 
RUN npm install

# runtime mínimo
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copia solo lo necesario desde deps
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY ./src ./src
EXPOSE 3000
CMD ["node", "-r", "newrelic", "src/index.js"]
