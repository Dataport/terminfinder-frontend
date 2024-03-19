FROM node:18.19.1-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build project
COPY tsconfig.json angular.json prebuild.js ./
COPY src/ ./src/
RUN npm run build-docker-prod

# We use the officially supported unprivileged image from nginx,
# as recommended here: https://hub.docker.com/_/nginx#Running%20nginx%20as%20a%20non-root%20user
FROM nginxinc/nginx-unprivileged:1.23.3-alpine
# FROM docker.io/nginxinc/nginx-unprivileged:1.23.3-alpine
WORKDIR /usr/share/nginx/html

# Prepare files
USER 0
COPY docker-replace-parameters.sh /docker-entrypoint.d/docker-replace-parameters.sh
COPY --from=build /app/dist /usr/share/nginx/html/.
RUN chown -R 101:101 /usr/share/nginx/html

# Reset to unprivileged
USER 101
