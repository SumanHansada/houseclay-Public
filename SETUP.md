# 🏗️ Houseclay Developer Setup Guide

This guide covers the complete setup for the **Houseclay Monorepo**, including the Java/Docker backend and Next.js frontends (`hc-frontend` and `zebra-ui`).

---

## 1. Prerequisites

Ensure you have the following installed before starting:

- **Docker Desktop** (Required for Backend, DB, ElasticSearch)
- **Node.js (v18+) & npm** (Required for Frontends)
- **mkcert** (Required for local SSL/HTTPS)
- **Java 17 SDK** _(Optional: Only if running backend manually without Docker)_

---

## 2. SSL Certificates (mkcert)

We use `mkcert` to simulate valid HTTPS locally. This is required because our Production setup uses **Secure Cookies** (`SameSite=None`), which browsers block on insecure HTTP connections.

### Step 2.1: Install mkcert

- **Mac (Homebrew):**

```bash
brew install mkcert nss

```

- **Windows (Chocolatey):**

```powershell
choco install mkcert

```

### Step 2.2: Generate Certificates

Run the following commands in your terminal:

```bash
# 1. Install the local CA
mkcert -install

# 2. Update your hosts file to map the custom domain
# Open hosts file: sudo nano /etc/hosts (Mac/Linux) or Notepad as Admin (Windows)
# Add this line:
# 127.0.0.1   localhost.houseclay.com

# 3. Generate the certificates
# Run this inside the /hc-frontend (and /zebra-ui) folder:
mkdir certificates
cd certificates
mkcert localhost.houseclay.com

```

### Step 2.3: Verify Files

You should now have two files in `hc-frontend/certificates/`:

- `localhost.houseclay.com.pem` (The Certificate)
- `localhost.houseclay.com-key.pem` (The Private Key)

> **⚠️ Git Warning:** Ensure `*.pem` and `certificates/` are added to your `.gitignore`. **Never commit these keys.**

---

## 3. Backend Setup (Docker)

The backend service includes Spring Boot, Postgres, ElasticSearch, and pgAdmin. We use Docker Compose to spin this up instantly.

**Location:** `/hc-backend`

### Setup Steps

1. Create a `.env` file in `/hc-backend` with your secrets:

```properties
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password
PGADMIN_USERNAME=admin@houseclay.com
PGADMIN_PASSWORD=admin

```

2. Start the stack:

```bash
docker-compose up --build

```

### Service URL Mapping

| Service           | URL                     | Credentials |
| ----------------- | ----------------------- | ----------- |
| **Backend API**   | `http://localhost:8080` | -           |
| **Postgres**      | `localhost:5432`        | See `.env`  |
| **ElasticSearch** | `http://localhost:9200` | -           |
| **pgAdmin**       | `http://localhost:8081` | See `.env`  |

---

## 4. Frontend Setup

**Locations:** `/hc-frontend` and `/zebra-ui`

Our setup supports 3 standardized workflows to handle development and production needs.

### The Workflow Matrix

| Scenario            | Command              | Protocol | Backend Source   | Use Case                                                       |
| ------------------- | -------------------- | -------- | ---------------- | -------------------------------------------------------------- |
| **1. Standard Dev** | `npm run dev`        | `HTTP`   | **Local Docker** | **Daily Coding.** Safe, fast, offline-capable.                 |
| **2. Debug Hosted** | `npm run dev:hosted` | `HTTPS`  | **Hosted (AWS)** | **Bug Fixing.** Debugging issues that only exist on Prod data. |
| **3. Prod Build**   | `npm run start`      | `HTTPS`  | **Hosted (AWS)** | **Deployment.** The exact command used in production.          |

### Environment Configuration

We do **not** use `.env.local`. Variables are managed via these default files and script overrides:

1. **`.env.development` (Default)**

- Used automatically by `npm run dev`.
- Sets API to `http://localhost:8080`.

2. **`.env.production` (Default)**

- Used automatically by `npm run build` / `start`.
- Sets API to `https://apis.houseclay.com`.

### Running the Project

```bash
# 1. Install dependencies
npm install

# --- SCENARIO 1: Standard Development (Recommended) ---
# Connects to your local Docker backend.
# Runs on: http://localhost:3000
npm run dev

# --- SCENARIO 2: Debugging with Production Data ---
# Connects to the live AWS backend.
# Runs on: https://localhost.houseclay.com:3000
# ⚠️ WARNING: You are interacting with REAL user data.
npm run dev:hosted

# --- SCENARIO 3: Production Build Preview ---
# Builds the optimized app and connects to AWS backend.
# Runs on: https://localhost.houseclay.com:3000
npm run build
npm run start

```
