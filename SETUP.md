# 🏗️ Houseclay Developer Setup Guide

This guide covers the complete setup for the **Houseclay Monorepo**. We support two workflows:

- **Method A (Docker-First):** Run everything (Frontend + Backend) inside Docker. Zero local setup required.
- **Method B (Hybrid):** Run Backend in Docker, but Frontend locally. Best for active frontend development.

## 📋 Table of Contents

1. Prerequisites
2. Global Configuration (Root .env)
3. Method A: Docker-First Workflow (Zero Setup)
4. Method B: Hybrid Workflow (Standard Dev)
5. SSL Certificates (Required for Method B)

---

## 1. Prerequisites

Ensure you have the following installed:

- **Docker Desktop** (Required for everyone)
- **Node.js (v22+)** (Required for Method B)
- **mkcert** (Required for Method B / HTTPS testing)

---

## 2. Global Configuration (Root .env)

Before running anything, you need the master environment file.

1. Create a `.env` file in the **Root** folder (`/houseclay/.env`).
2. Add the following infrastructure secrets:

```properties
# --- INFRASTRUCTURE SECRETS ---
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=houseclay_local
POSTGRES_PORT=5432

# ElasticSearch
ELASTIC_PORT=9200

# PgAdmin
PGADMIN_EMAIL=admin@houseclay.com
PGADMIN_PASSWORD=admin1234
PGADMIN_PORT=8081

# Frontend Ports
MAIN_APP_PORT=3000
ADMIN_APP_PORT=3001

```

---

## 3. Method A: Docker-First Workflow (Zero Setup)

**Best for:** Backend Devs, QA, or running the whole stack without installing Node.js locally.

This uses **Docker Profiles** to start exactly what you need. All commands are run from the **Root Folder**.

### Available Profiles

| Profile          | Command                                  | What it starts                  | URL                     |
| ---------------- | ---------------------------------------- | ------------------------------- | ----------------------- |
| **Backend Only** | `docker compose --profile backend up`    | Postgres, Elastic, Java Backend | `http://localhost:8080` |
| **Main Stack**   | `docker compose --profile houseclay up`  | Backend + **Main Website**      | `http://localhost:3000` |
| **Admin Stack**  | `docker compose --profile zebra up`      | Backend + **Admin Portal**      | `http://localhost:3001` |
| **Full Stack**   | `docker compose --profile full-setup up` | Everything                      | Both URLs above         |

### Key Features

- **Hot Reloading:** Yes! The local folders are "bound" to the container. You can edit files in `/hc-frontend` and the Docker container will update automatically.
- **HTTP Only:** This mode runs in HTTP. It does not use the HTTPS/SSL setup.
- **Node Version:** Runs on `node:22-alpine`.

---

## 4. Method B: Hybrid Workflow (Standard Dev)

**Best for:** Frontend Developers who need deep debugging, browser tools, or HTTPS testing.

In this workflow, you run the **Backend via Docker**, but run the **Frontend manually** on your machine.

### Step 1: Start the Backend

From the **Root Folder**, start only the backend infrastructure:

```bash
docker compose --profile backend up

```

- _Services:_ Postgres, ElasticSearch, pgAdmin, Java Backend.
- _Backend URL:_ `http://localhost:8080`

### Step 2: Start the Frontend (The Workflow Matrix)

Navigate to your frontend folder (`cd hc-frontend` or `cd zebra-ui`) and choose your scenario.

| Scenario            | Command              | Protocol | Backend Source   | Use Case                                                                       |
| ------------------- | -------------------- | -------- | ---------------- | ------------------------------------------------------------------------------ |
| **1. Standard Dev** | `npm run dev`        | `HTTP`   | **Local Docker** | **Daily Coding.** Safe, fast, connects to the Docker backend you just started. |
| **2. Debug Hosted** | `npm run dev:hosted` | `HTTPS`  | **Hosted (AWS)** | **Bug Fixing.** Connects your local frontend to the **Production Backend**.    |
| **3. Prod Build**   | `npm run start`      | `HTTPS`  | **Hosted (AWS)** | **Deployment Preview.** Simulates the exact production build.                  |

---

## 5. SSL Certificates (mkcert)

**Required ONLY for Method B (Scenarios 2 & 3).**

We use `mkcert` to simulate HTTPS locally, which is required for **Secure Cookies** (`SameSite=None`).

### Step 5.1: Install & Generate

```bash
# 1. Install mkcert
brew install mkcert nss  # Mac
choco install mkcert     # Windows

# 2. Initialize CA
mkcert -install

# 3. Update Hosts File (/etc/hosts or C:\Windows\System32\drivers\etc\hosts)
# Add: 127.0.0.1   localhost.houseclay.com

# 4. Generate Certificates (Inside /hc-frontend/certificates)
mkcert localhost.houseclay.com

```

### Step 5.2: Verify

Ensure you have `localhost.houseclay.com.pem` and `localhost.houseclay.com-key.pem` in your `certificates/` folder.

> **⚠️ Git Warning:** Never commit `.pem` files. They are already in `.gitignore`.

---

## 📚 Appendix: Service Credentials

| Service           | URL              | User / Email          | Password           |
| ----------------- | ---------------- | --------------------- | ------------------ |
| **Backend API**   | `localhost:8080` | -                     | -                  |
| **Postgres**      | `localhost:5432` | `postgres`            | `mysecretpassword` |
| **pgAdmin**       | `localhost:8081` | `admin@houseclay.com` | `admin1234`        |
| **ElasticSearch** | `localhost:9200` | -                     | -                  |
