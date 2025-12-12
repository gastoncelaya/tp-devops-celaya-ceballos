# Etapa de instalacion de DEPS
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ libc6-compat
COPY package.json ./
RUN npm ci

# ETAPA DE BUILD (Builder)
FROM node:20-alpine AS deps
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm prune --production

# Soluciona error de módulos no cargados, visible previamente en Render.
# Lo que hace es instalar las herramientas que necesita New Relic para compilar.
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# CORRECCIÓN: TAMAÑO
# Cambiamos el anterior npm install por npm ci --omit=dev para NO instalar 'devDependencies' (como jest, eslint, etc.).
# Esto hace que la carpeta 'node_modules' sea mucho más pequeña.
RUN npm ci --omit=dev


# 2. ETAPA FINAL (Runner)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production 

# CORRECIÓN: SEGURIDAD
# Copiamos los archivos necesarios dándole propiedad al usuario 'node'.
# Este usuario ya viene creado en la imagen 'node:alpine' y no tiene permisos de root, reduciendo superficie de ataque.
COPY --from=deps --chown=node:node /app/package*.json ./
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node ./src ./src 

# Le decimos al contenedor que corra el resto de los comandos como 'node'
USER node

EXPOSE 3000 
CMD ["node", "src/index.js"] 
