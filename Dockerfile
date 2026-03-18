# -----------------------------
# Stage 1 — Build the Vite app
# -----------------------------
FROM node:18-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -----------------------------------
# Stage 2 — Production Node server
# -----------------------------------
FROM node:18-bullseye AS runtime
WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=build /app/dist ./dist
COPY server ./server

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server/index.cjs"]
