# Production Deployment Guide: ELITE GROUP – SS CHIT FUNDS

This document covers everything required to deploy, configure, and maintain the **ELITE GROUP – SS CHIT FUNDS** website and management platform in a production environment.

---

## 1. Quick Start / Production Build & Run

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20+ LTS`)
- **npm**: `v9.0.0` or higher

### Commands
```bash
# 1. Install production dependencies
npm install

# 2. Check TypeScript types
npm run lint

# 3. Compile and bundle frontend for production
npm run build

# 4. Start production web and API server
npm start
```
The server will start listening on port `3000` (or the port specified by the `PORT` environment variable).

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PORT` | No | `3000` | HTTP port on which the server listens |
| `NODE_ENV` | No | `production` | Environment mode (`production` / `development`) |
| `ADMIN_PASSWORD` | Recommended | `EliteTurf10` | Password required to access the Admin Portal |
| `WHATSAPP_API_TOKEN` | Optional | - | Meta WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional | - | Meta WhatsApp Cloud API Phone Number ID |
| `WHATSAPP_WEBHOOK_URL` | Optional | - | Custom webhook for receiving/forwarding notifications |

> [!NOTE]
> All sensitive configuration can also be configured dynamically from the web interface in the **Admin Portal -> WhatsApp Gateway** tab once logged in.

---

## 3. Deployment Methods

### Option A: Cloud Platforms (Render, Railway, Fly.io, Heroku)

1. **Build Command**:
   ```bash
   npm install && npm run build
   ```
2. **Start Command**:
   ```bash
   npm start
   ```
3. **Port Binding**: Set `PORT` to the port provided by the platform (e.g., automatically injected on Render/Railway).
4. **Persistent Disk (Optional but recommended)**:
   - Mount a persistent volume to `/app/data` so that enquiry records in `data/enquiries.json` persist across container redeployments.

### Option B: Linux VPS (Ubuntu/Debian) with PM2 & Nginx

1. **Clone and Install**:
   ```bash
   cd /var/www/ss-chit-funds
   npm install
   npm run build
   ```
2. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ss-chit-funds" --interpreter tsx
   pm2 save
   pm2 startup
   ```
3. **Nginx Reverse Proxy Configuration**:
   ```nginx
   server {
       listen 80;
       server_name ss-chit-funds.com www.ss-chit-funds.com;

       location /assets/ {
           proxy_pass http://127.0.0.1:3000/assets/;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
4. **Enable HTTPS with Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d ss-chit-funds.com -d www.ss-chit-funds.com
   ```

### Option C: Docker Container Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t ss-chit-funds:latest .
   ```
2. **Run container with persistent data volume**:
   ```bash
   docker run -d \
     --name ss-chit-funds \
     -p 3000:3000 \
     -e ADMIN_PASSWORD="YourSecurePasswordHere" \
     -v $(pwd)/data:/app/data \
     --restart unless-stopped \
     ss-chit-funds:latest
   ```

---

## 4. Production Security & Performance Verification

- **Hashed Assets Caching**: Static assets in `/assets/` are served with `Cache-Control: public, max-age=31536000, immutable`.
- **Security Headers**: All responses include:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Zero Frontend Secret Leakage**: Admin credentials and gateway tokens are never bundled into the client JavaScript bundle.
- **Health Check Endpoint**: `GET /api/stats` returns status `200` with JSON statistics, suitable for load balancer health monitors.
- **Fail-Safe Enquiries**: If external WhatsApp gateways are offline or unconfigured, the system automatically preserves the lead in the database and generates direct 1-click WhatsApp links to both official business numbers (`+91 7338736352` and `+91 9345836032`).
