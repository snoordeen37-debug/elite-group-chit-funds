import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/apiHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure database directory exists in production environment
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Basic Production Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Endpoints
app.all('/api/*', async (req, res) => {
  try {
    const result = await handleApiRequest(
      req.path,
      req.method || 'GET',
      req.body,
      req.query
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
});

// Serve frontend static assets with aggressive caching for hashed files
app.use(
  '/assets',
  express.static(path.resolve(__dirname, 'dist', 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
);

// Serve general static files (favicons, robots.txt, etc.)
app.use(
  express.static(path.resolve(__dirname, 'dist'), {
    maxAge: '1h',
  })
);

// SPA Fallback: Serve index.html for any frontend client routes
app.get('*', (req, res) => {
  const indexPath = path.resolve(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Production build not found. Please run "npm run build" first.');
  }
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  ELITE GROUP – SS CHIT FUNDS PVT LTD Production Server`);
  console.log(`  Listening on: http://localhost:${PORT}`);
  console.log(`  Environment:  ${process.env.NODE_ENV || 'production'}`);
  console.log(`====================================================`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nTerminating server gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
