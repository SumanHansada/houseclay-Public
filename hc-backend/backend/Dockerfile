# STAGE 1: Build
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven Wrapper and pom
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# IMPORTANT: Fix line endings and permissions
RUN tr -d '\r' < mvnw > mvnw_unix && \
    mv mvnw_unix mvnw && \
    chmod +x mvnw

# Build the JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# STAGE 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]