# Deployment Guide

Follow these steps to deploy your **CurshUni** application.

## Prerequisites
- Accounts on [GitHub](https://github.com), [Supabase](https://supabase.com), [Koyeb](https://koyeb.com), and [Cloudflare](https://dash.cloudflare.com).
- Git installed locally.

---

## 1. Push Changes to GitHub

Your repository is already connected to: `https://github.com/TheAyanfeoluwa/crushuni.git`

Sync the deployment configurations we just made:

1.  **Commit and Push**:
    ```bash
    git add .
    git commit -m "Configure app for deployment (Procfile, CORS, Environment vars)"
    git push
    ```

---

## 2. Supabase Setup (Database)

1.  Create a new project on **Supabase**.
2.  Go to **Project Settings** -> **Database**.
3.  Copy the **Connection String** (URI). It looks like:
    `postgresql://postgres:[PASSWORD]@db.project.supabase.co:5432/postgres`
    *Replace `[PASSWORD]` with your actual database password.*
4.  (Optional) Go to **API Settings** if you need Anon Keys, but your backend currently uses the direct Database connection string.

---

## 3. Koyeb Setup (Backend)

1.  Log in to **Koyeb**.
2.  Click **Create App**.
3.  Select **GitHub** as the source.
4.  Choose your `crushuni` repository.
5.  **Configure Service**:
    -   **Root Directory**: `backend` (Important! Tell it where the python code is).
    -   **Builder**: Standard (Python).
    -   **Run Command**: `uvicorn main:app --host 0.0.0.0 --port 8000` (or leave default if it detects the Procfile).
    -   **Instance**: Select **Nano** (Free tier).
6.  **Environment Variables**:
    Add the following variables:
    -   `DATABASE_URL`: (Paste your Supabase connection string)
    -   `SECRET_KEY`: (Generate a long random string for security)
    -   `GENAI_API_KEY`: (Your Gemini API Key)
    -   `ALLOWED_ORIGINS`: `https://YOUR-CLOUDFLARE-APP-URL.pages.dev` (You won't know this until step 4. For now, put `*` or just wait).
7.  Click **Deploy**.
8.  **Get the URL**: Once live, copy the public URL (e.g., `https://curshuni-backend-xyz.koyeb.app`).

---

## 4. Cloudflare Pages Setup (Frontend)

1.  Log in to **Cloudflare Dashboard** -> **Workers & Pages**.
2.  Click **Create Application** -> **Pages** -> **Connect to Git**.
3.  Select the `crushuni` repository.
4.  **Build Settings**:
    -   **Framework Preset**: Vite / React.
    -   **Build Command**: `npm run build`
    -   **Build Output Directory**: `dist`
    -   **Root Directory**: (Leave empty as your frontend package.json is in the root).
5.  **Environment Variables**:
    -   Variable Name: `VITE_API_URL`
    -   Value: `https://curshuni-backend-xyz.koyeb.app/api` (The Koyeb URL from Step 3 + `/api`).
6.  Click **Save and Deploy**.

---

## 5. Final Connection

1.  Once Cloudflare deploys, you will get a URL like `https://curshuni.pages.dev`.
2.  Go back to **Koyeb** settings.
3.  Update the `ALLOWED_ORIGINS` environment variable to match your Cloudflare URL (e.g., `https://curshuni.pages.dev`).
4.  **Redeploy** Koyeb to apply changes.

**Done!** Your app is now live.
