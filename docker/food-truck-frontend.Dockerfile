FROM node:12 AS build
WORKDIR /build
COPY . .

RUN yarn install
RUN yarn run build
RUN ls -lR

FROM node:12
WORKDIR /app
COPY --from=build /build .

RUN chmod +x ./frontend-entrypoint

# Running the app
ENTRYPOINT ./frontend-entrypoint