FROM node:12 AS build
WORKDIR /build
COPY . .

RUN cd food-truck-frontend
RUN yarn install
RUN yarn run build

FROM node:12
WORKDIR /app
COPY --from=build /build/food-truck-frontend .

RUN chmod +x ./frontend-entrypoint

# Running the app
ENTRYPOINT ./frontend-entrypoint