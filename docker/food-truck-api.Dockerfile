FROM openjdk:14 AS build

# Possible to execute the mave bom build here? Would need to dowload maven...

WORKDIR /build

COPY . .
RUN ./gradlew build -p .
# --no-daemon

FROM openjdk:14
WORKDIR /app
COPY --from=build /build/build/libs/build*.jar app.jar

# Running the app exec $JAVA_OPTS
ENTRYPOINT java\ -jar\ $JAVA_OPTS\ app.jar
