# ---------------------------------------------------------------------------
# STAGE 1: Build
# ---------------------------------------------------------------------------
# We use the official Maven image which comes with JDK 17 and Maven pre-installed
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy only the pom.xml first
COPY pom.xml .

# 2. Go offline (This downloads all dependencies and caches them in a docker layer)
# This step makes future builds SUPER fast because it won't re-download jars unless pom.xml changes
RUN mvn dependency:go-offline

# 3. Copy your source code
COPY src ./src

# 4. Build the JAR
RUN mvn clean package -DskipTests

# ---------------------------------------------------------------------------
# STAGE 2: Runtime
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-jammy

# ---------------------------------------------------------------------------
# SHARED CONFIGURATION
# ---------------------------------------------------------------------------
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]