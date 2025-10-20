
FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./

RUN yarn install

COPY . .


RUN yarn run build


RUN ls -la /app/dist


FROM node:20-alpine

WORKDIR /app

EXPOSE 3000


COPY --from=builder /app/dist ./dist                
COPY --from=builder /app/node_modules ./node_modules   
COPY --from=builder /app/package.json ./package.json


CMD ["node", "dist/src/main.js"]