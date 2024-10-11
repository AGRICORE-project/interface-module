FROM node:20-bookworm-slim as builder

LABEL MAINTAINER="XXX"

WORKDIR /app

RUN npm install -g @angular/cli --force

COPY package*.json ./
RUN npm ci

COPY . .
RUN ng build


FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/agricore-interface /usr/share/nginx/html

EXPOSE 80
# The NGINX image automatically runs NGINX, so there's no need for a CMD instruction
