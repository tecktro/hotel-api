FROM node:16 AS base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base
RUN npm install glob rimraf
RUN npm install
ENV DB_URL="mongodb+srv://hotelAdmin:5bjPuOMI6TJTR4g5@cluster0.af8ohe8.mongodb.net/hotel_db"
ENV EXTERNAL_API="http://localhost:5000/hotels/"
COPY . .
RUN npm run build
CMD ["node", "dist/main"]
