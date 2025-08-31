# Etapa 1: dependencias (builder)
FROM node:20-alpine AS deps
WORKDIR /app
# 1) Copiamos solo los manifests para aprovechar la cache de Docker
COPY package*.json ./
# 2) Instalamos dependencias exactas (reproducible en CI)
RUN npm ci
# 3) Copiamos el resto del código
COPY . .

# Etapa 2: runtime mínimo
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copiamos solo lo necesario desde deps (no copiamos tests ni .git)
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]