FROM maven:3.9.6-amazoncorretto-17 AS builder

WORKDIR /app

# Cache dependencies first
COPY pom.xml .
RUN mvn -B -e -U dependency:go-offline

# Copy sources and build
COPY src src
RUN mvn -B clean package -DskipTests

# Runtime image
FROM amazoncorretto:17

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
