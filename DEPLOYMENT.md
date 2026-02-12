
# Deployment Guide (Railway + Upstash)

This guide uses **Railway** for hosting all services/database and **Upstash** for Kafka.

## Prerequisites
1.  **GitHub Repo**: Push this code to a GitHub repository.
2.  **Railway Account**: [railway.app](https://railway.app) (Requires trial or subscription).
3.  **Upstash Account**: [upstash.com](https://upstash.com) (Free tier available).

---

## 1. Setup Kafka (Upstash)
1.  Log in to Upstash and create a new **Kafka Cluster**.
2.  Copy these credentials for later:
    -   **Endpoint** (Server URL)
    -   **Username**
    -   **Password**

---

## 2. Setup Railway Project
1.  Go to Railway -> **New Project** -> **Provision PostgreSQL**.
    -   This creates a database.
    -   Click on the Postgres card -> **Variables**.
    -   Copy `DATABASE_URL`.

2.  **Add Services (Monorepo Setup)**
    You will add the **SAME GitHub Repo** 5 times, but configure them differently.

### A. Primary Backend
1.  **New** -> **GitHub Repo** -> Select your repo.
2.  **Settings** -> **Root Directory**: `primary_backend`
3.  **Variables**: Add:
    -   `DATABASE_URL`: (Paste from Postgres service)
    -   `JWT_SECRET`: (Random string)
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Networking**: Enable Public Domain (e.g., `zapier-backend.up.railway.app`).

### B. Hooks Service
1.  **New** -> **GitHub Repo** -> Select repo again.
2.  **Settings** -> **Root Directory**: `hooks`
3.  **Variables**:
    -   `DATABASE_URL`: (Paste from Postgres)
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Networking**: Enable Public Domain (e.g., `zapier-hooks.up.railway.app`).

### C. Processor (Worker)
1.  **New** -> **GitHub Repo** -> Select repo.
2.  **Settings** -> **Root Directory**: `processer`
3.  **Variables**:
    -   `DATABASE_URL`: (Paste from Postgres)
    -   `KAFKA_BROKER`: (Upstash Endpoint)
    -   `KAFKA_USERNAME`: (Upstash Username)
    -   `KAFKA_PASSWORD`: (Upstash Password)
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Networking**: None needed (Internal worker).

### D. Worker (Email Sender)
1.  **New** -> **GitHub Repo** -> Select repo.
2.  **Settings** -> **Root Directory**: `worker`
3.  **Variables**:
    -   `DATABASE_URL`: (Paste from Postgres)
    -   `KAFKA_BROKER`: (Upstash Endpoint)
    -   `KAFKA_USERNAME`: (Upstash Username)
    -   `KAFKA_PASSWORD`: (Upstash Password)
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Networking**: None needed.

### E. Frontend
1.  **New** -> **GitHub Repo** -> Select repo.
2.  **Settings** -> **Root Directory**: `frontend`
3.  **Variables**:
    -   `NEXT_PUBLIC_BACKEND_URL`: `https://<YOUR-PRIMARY-BACKEND-DOMAIN>`
    -   `NEXT_PUBLIC_HOOK_URL`: `https://<YOUR-HOOKS-DOMAIN>`
4.  **Networking**: Enable Public Domain (This is your main site URL).

---

## 3. Connecting them
1.  Once **Backend** and **Hooks** are deployed, copy their public domains.
2.  Go to **Frontend** service -> **Variables**.
3.  Update `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_HOOK_URL` with the real https links.
4.  Redeploy Frontend.

## 4. Seeding Database
Since Railway creates a fresh DB, you need to seed it.
1.  In your **Local Terminal**:
    ```bash
    export DATABASE_URL="postgresql://postgres:password@roundhouse.proxy.rlwy.net:..." # Copy "Connection URL" from Railway Postgres
    
    cd primary_backend
    npx prisma db push

## 5. Troubleshooting

### ❌ Error: "You are trying to deploy the ROOT directory"
If you see this error in your Railway build logs, it means you missed the **Root Directory** setting.
1.  **Click on the Service** card (e.g., `primary_backend`) in your Project canvas.
2.  **Click on the "Settings" tab** in the top navigation bar of the service pane.
3.  **Scroll down** to the **"Service"** section (usually the very first section).
4.  Find the **"Root Directory"** field.
5.  **Enter the folder name** (e.g., `primary_backend`).
6.  Railway will automatically save and restart the build.
