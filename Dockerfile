FROM node:iron-alpine3.19 as build
LABEL authors="Diones Valentim Freitas <dionesfreitas@live.com>"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN ["npm", "run", "build:ts"]

FROM node:iron-alpine3.19 as production
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist/src ./
EXPOSE 8080
ENTRYPOINT ["node", "./index.js"]
