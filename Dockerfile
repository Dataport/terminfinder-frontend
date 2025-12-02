ARG BASE_REPO_URI=docker.io

FROM ${BASE_REPO_URI}/node:22.18.0-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build project
COPY tsconfig.json angular.json prebuild.js ./
COPY src/ ./src/
COPY .env/ ./.env/
RUN npm run build-docker

# We use the officially supported unprivileged image from nginx,
# as recommended here: https://hub.docker.com/_/nginx#Running%20nginx%20as%20a%20non-root%20user
FROM ${BASE_REPO_URI}/nginxinc/nginx-unprivileged:1.29.2-alpine

WORKDIR /usr/share/nginx/html

# Prepare files
USER 0
COPY docker-replace-parameters.sh /docker-entrypoint.d/60-docker-replace-parameters.sh
COPY --from=build /app/dist/browser /usr/share/nginx/html/.
RUN chown -R 101:0 /usr/share/nginx/html && chmod -R g+w /usr/share/nginx/html

# Reset to unprivileged
USER 101
