import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Serves `api/*.ts` during `vite dev` the same way Vercel does in production,
 * so `/api/track` and `/api/analytics-summary` work under a plain `npm run dev`
 * without the Vercel CLI. Each request loads the handler through Vite's SSR
 * module loader (TypeScript + hot reload for free) and wraps Node's req/res in
 * the subset of the VercelRequest/VercelResponse API the handlers use.
 *
 * Without this, Vite's SPA fallback answered `/api/...` with index.html
 * (HTTP 200, text/html) and the admin dashboard failed with "Request failed (200)".
 */
function vercelApiDev(): Plugin {
  let apiDir = '';
  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    config(_config, { mode }) {
      // api/*.ts reads its secrets from process.env (never from the client
      // bundle). Vite only exposes VITE_* to the browser, so load the full .env
      // into the dev-server process here, without overriding real env vars.
      const env = loadEnv(mode, process.cwd(), '');
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }
    },
    configResolved(config) {
      apiDir = resolve(config.root, 'api');
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        if (!url.pathname.startsWith('/api/')) return next();

        const name = url.pathname.slice('/api/'.length).replace(/\/+$/, '');
        const file = /^[a-zA-Z0-9_-]+$/.test(name) ? resolve(apiDir, `${name}.ts`) : '';
        if (!file || !existsSync(file)) {
          sendJson(res, 404, { error: `No API route for /api/${name}` });
          return;
        }

        try {
          const mod = await server.ssrLoadModule(file);
          await mod.default(await toVercelRequest(req, url), toVercelResponse(res));
        } catch (err) {
          if (err instanceof Error) server.ssrFixStacktrace(err);
          server.config.logger.error(
            `[api] /api/${name} failed: ${err instanceof Error ? err.stack : String(err)}`
          );
          if (!res.headersSent) {
            sendJson(res, 500, { error: err instanceof Error ? err.message : 'Internal error' });
          } else {
            res.end();
          }
        }
      });
    },
  };
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function toVercelRequest(req: IncomingMessage, url: URL) {
  req.setEncoding('utf8');
  let raw = '';
  for await (const chunk of req) raw += chunk;
  let body: unknown = raw;
  if (raw && String(req.headers['content-type'] ?? '').includes('application/json')) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
  }
  return Object.assign(req, { query: Object.fromEntries(url.searchParams), cookies: {}, body });
}

function toVercelResponse(res: ServerResponse) {
  const vres = Object.assign(res, {
    status(code: number) {
      res.statusCode = code;
      return vres;
    },
    json(body: unknown) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(body));
      return vres;
    },
    send(body: unknown) {
      if (body === undefined || body === null) {
        res.end();
      } else if (typeof body === 'object' && !Buffer.isBuffer(body)) {
        vres.json(body);
      } else {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/octet-stream');
        }
        res.end(body as string | Buffer);
      }
      return vres;
    },
    redirect(statusOrUrl: number | string, maybeUrl?: string) {
      const status = typeof statusOrUrl === 'number' ? statusOrUrl : 307;
      const location = typeof statusOrUrl === 'string' ? statusOrUrl : (maybeUrl ?? '/');
      res.statusCode = status;
      res.setHeader('Location', location);
      res.end();
      return vres;
    },
  });
  return vres;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDev()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
