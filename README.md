# Campaign Manager Application

A simple web application to manage advertising campaigns, built with Spring Boot (backend) and React (frontend).

## Features

* **CRUD operations** for campaigns
* **Account balance** management (deposit/withdraw)
* **Keyword** suggestions and **towns** data
* **API documentation** via Swagger/OpenAPI
* **CI/CD** pipeline with GitHub Actions and Heroku deployment

## Prerequisites

* Java 17 or later
* Maven 3.8+
* Node.js 18+ and npm
* Docker (for container deployment)
* Heroku account and CLI

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dslwa/SpringBootCRUD.git
   cd SpringBootCRUD
   ```

2. **Backend setup:**

   ```bash
   cd campaign
   mvn clean install
   mvn spring-boot:run
   ```

   Runs backend at `http://localhost:8080`.

3. **Frontend setup:**

   ```bash
   cd ../campaign-frontend
   npm install
   npm start
   ```

   Opens React app at `http://localhost:3000` and proxies API calls to backend.

## API Documentation

Swagger UI is available at:

```
http://localhost:8080/swagger-ui.html
```

Or use OpenAPI JSON:

```
http://localhost:8080/v3/api-docs
```

## CI/CD Pipeline

* **Build & Test:** Maven tests with JaCoCo coverage
* **Linting:** ESLint & Prettier for frontend
* **Deployment:** Docker container deployed to Heroku on push to `main`

## Deployment

1. **Login to Heroku:**

   ```bash
   heroku login
   heroku container:login
   ```
2. **Build & push Docker image:**

   ```bash
   docker build -t registry.heroku.com/<app-name>/web campaign
   docker push registry.heroku.com/<app-name>/web
   ```
3. **Release:**

   ```bash
   heroku container:release web --app <app-name>
   ```

## License

MIT © Your Name
