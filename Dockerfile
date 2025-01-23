
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV VITE_GOOGLE_CLIENT_ID=1083557259488-8muncd0e4kd7r3skjdtrp5secjk5hhra.apps.googleusercontent.com 
ENV VITE_API_BASE_URL=https://back-preanalise-1083557259488.us-central1.run.app/

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
