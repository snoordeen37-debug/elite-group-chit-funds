# ELITE GROUP – SS CHIT FUNDS

> **Trusted Chit Investment Plans | Managed by ELITE TURF**  
> CIN: U72900MH1995PLC095642 • Kuttaiyur, Mettupalayam – 641104

![Brand Theme](https://img.shields.io/badge/Theme-Imperial%20Gold%20%26%20Deep%20Navy-C5A028?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

---

## 🏛️ Overview

**ELITE GROUP – SS CHIT FUNDS** provides structured, transparent chit-fund investment plans designed to help members save and borrow with discipline. Managed by **ELITE TURF**, based in Mettupalayam, Tamil Nadu.

This repository contains the complete production-ready web application, customer lead capture system, interactive financial calculators, Google Maps integration, dual WhatsApp business notification engine, and a password-protected Administrator CRM portal with Excel (.xlsx) and CSV export capabilities.

---

## ✨ Features

- **🏛️ Premium Brand Identity**: Imperial Gold & Dark Navy aesthetic tailored for luxury financial services.
- **📈 6 Structured Chit Plans**: Full catalog ranging from ₹50,000 to ₹5,00,000 with detailed daily, weekly, and monthly installment breakdowns over 21-month tenure.
- **🧮 Interactive Chit Calculator**: Real-time investment and dividend projection calculator.
- **📱 Dual WhatsApp Notification Engine**: Automatically routes customer enquiries to both official business numbers:
  - **Primary Line**: `+91 7338736352`
  - **Secondary Line**: `+91 9345836032`
- **📍 Google Maps Integration**: Interactive preview and 1-click direction navigation to the ELITE TURF headquarters in Kuttaiyur, Mettupalayam.
- **🔐 Secure Admin Portal**:
  - Protected by server-side authentication (Password required: `EliteTurf10`).
  - CRM pipeline to manage customer leads (New, Contacted, Follow-up, Converted, Closed).
  - Inline follow-up notes with instant persistence.
  - WhatsApp Gateway settings manager (CallMeBot, UltraMsg, Meta Cloud API, Custom Webhooks).
- **📊 Professional Enquiry Export**:
  - Formatted Excel (`.xlsx`) workbooks with branding headers, frozen title rows, auto-filters, text-preserved mobile numbers (preventing scientific notation like `8.25E+09`), clean `₹` currency symbols, and clickable WhatsApp chat hyperlinks.
  - Formatted CSV exports with UTF-8 BOM encoding.
- **🚀 Production Optimized**:
  - Code-split vendor chunks (`vendor-excel`, `vendor-ui`, `vendor-react`).
  - Production Express server with security headers (`nosniff`, `SAMEORIGIN`, `X-XSS-Protection`).
  - SEO-ready with `sitemap.xml`, `robots.txt`, and Open Graph metadata.
  - Multi-stage `Dockerfile` for containerized cloud deployment.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend / API**: Node.js, Express, TSX
- **Export Engine**: ExcelJS
- **Bundler & Tooling**: Vite 6, TypeScript Compiler

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20+ LTS`)
- **npm**: `v9.0.0` or higher

### 1. Installation
```bash
git clone https://github.com/snoordeen37-debug/SSCHITFUNDS.git
cd SSCHITFUNDS
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure any optional variables (port defaults to `3000`, admin password defaults to `EliteTurf10`).

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Run
```bash
# Type check and build bundle
npm run lint
npm run build

# Start production server
npm start
```

---

## 🐳 Docker Deployment

```bash
# Build the container
docker build -t sschitfunds .

# Run container with persistent data storage
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data --name ss-chit-funds sschitfunds
```

---

## 🔒 Security & Admin Access

- To access the Admin Portal, click **"Admin Portal"** in the top navigation or navigate to `/#admin`.
- Enter the administrator password to unlock the CRM lead pipeline and gateway configuration.
- To change the admin password, define `ADMIN_PASSWORD` in your production environment variables.

---

## 📞 Business Contact

- **Address**: ELITE TURF, Ajandha Garden, Kuttaiyur, Mettupalayam – 641104
- **Primary Support**: +91 7338736352
- **Secondary Support**: +91 9345836032
- **Office Hours**: Monday – Saturday, 9:00 AM – 7:30 PM
