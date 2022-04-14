FROM mhart/alpine-node:11 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "80", "-s", "."]