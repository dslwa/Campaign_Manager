# Campaign Manager

[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://ancient-inlet-32210-0350a7d6b639.herokuapp.com)

**A lightweight web app for managing ad campaigns.**

---

## Key Features

* **Full CRUD:** Create, read, update, delete campaigns.
* **Financials:** Deposit and withdraw from account balance.
* **Dynamic Data:** Keyword suggestions and town selection.
* **Status Control:** Toggle campaigns ON/OFF.
* **Radius Filter:** Set campaign reach in kilometers.
* **API Docs:** Swagger UI for easy exploration.

---

## Tech Stack

* **Backend:** Spring Boot, H2 in-memory database
* **Frontend:** React with Create React App
* **CI/CD:** GitHub Actions, Docker, Heroku

---

## Setup & Run

```bash
# 1. Clone repo
git clone https://github.com/dslwa/SpringBootCRUD.git

# 2. Backend
cd SpringBootCRUD/campaign
mvn clean install
mvn spring-boot:run
# Server → http://localhost:8080

# 3. Frontend
cd ../campaign-frontend
npm ci
npm start
# App → http://localhost:3000
```

---

## API Documentation

* Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## Deployment

1. **Login to Heroku CLI**

   ```bash
   heroku login
   heroku container:login
   ```
2. **Build & Push Docker**

   ```bash
   docker build -t registry.heroku.com/<app-name>/web campaign
   docker push registry.heroku.com/<app-name>/web
   ```
3. **Release**

   ```bash
   heroku container:release web --app <app-name>
   ```

---

