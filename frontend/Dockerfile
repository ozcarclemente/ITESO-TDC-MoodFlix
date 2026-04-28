# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG API_URL
ARG TMDB_TOKEN
COPY package.json ./
RUN npm install
COPY . .
RUN echo "export const environment = { production: true, apiUrl: '${API_URL}', tmdbToken: '${TMDB_TOKEN}' };" > src/environment.ts
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
