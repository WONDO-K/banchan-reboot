# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

RUN npm install --save-dev ts-node

RUN npm install @types/node --save-dev

RUN npm install @types/crypto-js --save-dev

COPY . .

RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /etc/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]