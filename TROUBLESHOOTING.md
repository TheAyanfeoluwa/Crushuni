# Deployment Troubleshooting Guide

If the application works locally but fails in production (Cloudflare/Koyeb), follow these steps to identify and fix the issue.

## 1. Check Frontend Configuration (Cloudflare)

I have added a debug log to the frontend.
1. Open your deployed website (e.g., `https://curshuni.pages.dev`).
2. Right-click anywhere and select **Inspect** -> **Console**.
3. Look for the message:
   `Current API Base URL: ...`

### Formatting Check
- **Correct**: `https://curshuni-backend-xyz.koyeb.app/api`
- **Incorrect (Localhost)**: `http://localhost:8000/api` -> This means your `VITE_API_URL` environment variable is missing in Cloudflare.
- **Incorrect (Missing /api)**: `https://curshuni-backend-xyz.koyeb.app` -> You must include `/api` at the end.

**Fix**: Go to Cloudflare Dashboard -> Pages -> Settings -> Environment Variables and ensure `VITE_API_URL` is set correctly.

## 2. Check Backend Configuration (Koyeb)

If the URL is correct but requests fail, check the Network tab.
1. In Developer Tools, go to the **Network** tab.
2. Refresh the page or try to log in.
3. Click on the red (failed) request.

### Scenario A: CORS Error
If you see "CORS error" or "Blocked by CORS policy":
- It means the backend is rejecting the frontend.
- **Fix**: Go to Koyeb -> Settings -> Environment Variables.
- Ensure `ALLOWED_ORIGINS` contains your EXACT frontend URL (e.g., `https://curshuni.pages.dev`). No trailing slashes.

### Scenario B: 500 Internal Server Error
- It means the backend is crashing.
- **Fix**: Check Koyeb Logs.
- Common causes:
    - **Database URL**: I added a fix for `postgres://` vs `postgresql://`, but make sure the password is correct.
    - **Gemini Key**: Ensure `GENAI_API_KEY` is set.

## 3. Redeploy
After making changes to environment variables in Cloudflare or Koyeb, you usually need to **Redeploy** for them to take effect.
- **Cloudflare**: Manage Deployment -> Retry / Redeploy.
- **Koyeb**: Redeploy.

## 4. Local Testing with Production Backend
To test if the backend is working without deploying the frontend:
1. Run frontend locally: `npm run dev`
2. Update your local `.env` (if you have one) or temporarily edit `axios.js` to point to the Koyeb URL.
3. If this works, the issue is definitely Cloudflare configuration.
