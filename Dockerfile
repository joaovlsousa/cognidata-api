FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
RUN apk add --no-cache \
    openssl \
    libssl3 \
    libc6-compat
COPY . .
RUN npx prisma generate
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start", ":", "dev"]
