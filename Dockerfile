ARG BASE_REPO_URI=docker.io
ARG NODE_TAG=18.13.0
ARG NGINX_TAG=1.23.3-alpine

FROM ${BASE_REPO_URI}/node:${NODE_TAG} as build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build project
COPY tsconfig.json angular.json prebuild.js ./
COPY src/ ./src/
RUN npm run build-docker

# We use the officially supported unprivileged image from nginx,
# as recommended here: https://hub.docker.com/_/nginx#Running%20nginx%20as%20a%20non-root%20user
FROM ${BASE_REPO_URI}/nginxinc/nginx-unprivileged:${NGINX_TAG}
# FROM docker.io/nginxinc/nginx-unprivileged:1.23.3-alpine
WORKDIR /usr/share/nginx/html

# Prepare files
USER 0
COPY docker-replace-parameters.sh /docker-entrypoint.d/60-docker-replace-parameters.sh
COPY --from=build /app/dist /usr/share/nginx/html/.
RUN chown -R 101:101 /usr/share/nginx/html

# Reset to unprivileged
USER 101
