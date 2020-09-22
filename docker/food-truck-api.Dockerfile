FROM openjdk:14 AS build

# Possible to execute the mave bom build here? Would need to dowload maven...

WORKDIR /build

COPY . .
RUN ./food-truck-api/gradlew build --no-daemon -p .

FROM openjdk:14
WORKDIR /app
COPY --from=build /build/food-truck-api/build/libs/food-truck-api-*.jar app.jar

# Running the app
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar