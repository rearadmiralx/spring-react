## Stage 1: Build the React app
#FROM node:22 AS build
#WORKDIR /app
#COPY src/main/frontend/package.json src/main/frontend/package-lock.json ./
#RUN npm install
#COPY src/main/frontend ./
#RUN npm run build
#
## Stage 2: Run the application
#FROM openjdk:17-jdk-slim
#WORKDIR /app
#
## Copy the built JAR file from the local build
#COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
#
## Copy the React build files to the appropriate location for serving
#COPY --from=build /app/build /app/src/main/resources/static
#
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built Spring Boot jar into the container
COPY docker/demo-0.0.1-SNAPSHOT.jar ./app.jar

# Expose port 8080
EXPOSE 8080

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
