FROM node:18 AS frontend
WORKDIR /app/campaign-frontend
COPY campaign-frontend/package*.json ./
RUN npm ci
COPY campaign-frontend/ ./
RUN npm run build


FROM maven:3.9.8-eclipse-temurin-21 AS backend-build
WORKDIR /app/campaign
COPY campaign/pom.xml ./
COPY campaign/src ./src
COPY --from=frontend /app/campaign-frontend/build ./src/main/resources/static
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app
COPY --from=backend-build /app/campaign/target/*.jar app.jar


CMD java -Dserver.port=$PORT -jar /app/app.jar

