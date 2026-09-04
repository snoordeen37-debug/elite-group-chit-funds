import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { handleApiRequest } from './server/apiHandler';

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'ss-chit-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
        const queryParams: Record<string, string> = {};
        urlObj.searchParams.forEach((val, key) => {
          queryParams[key] = val;
        });

        let bodyData: any = null;
        if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const rawBody = Buffer.concat(buffers).toString('utf-8');
          try {
            bodyData = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            bodyData = {};
          }
        }

        try {
          const result = await handleApiRequest(
            urlObj.pathname,
            req.method || 'GET',
            bodyData,
            queryParams
          );
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.data));
        } catch (error: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
        const queryParams: Record<string, string> = {};
        urlObj.searchParams.forEach((val, key) => {
          queryParams[key] = val;
        });

        let bodyData: any = null;
        if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const rawBody = Buffer.concat(buffers).toString('utf-8');
          try {
            bodyData = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            bodyData = {};
          }
        }

        try {
          const result = await handleApiRequest(
            urlObj.pathname,
            req.method || 'GET',
            bodyData,
            queryParams
          );
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.data));
        } catch (error: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-excel': ['exceljs'],
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react', 'motion'],
          },
        },
      },
    },
  };
});
