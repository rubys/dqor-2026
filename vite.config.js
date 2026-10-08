import { defineConfig } from "vite";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".map": "application/json",
  ".woff2": "font/woff2",
  ".rb": "text/plain",
  ".erb": "text/plain",
  ".rbs": "text/plain",
  ".tgz": "application/gzip",
};

// Serve the committed demo snapshots at the SAME absolute paths the
// production deck reaches them at. The blog/playground builds bake
// /roundhouse/... base paths in, and on rubys.github.io those paths
// resolve to the live roundhouse Pages site (same origin as this
// deck). In dev — or with the wifi dead — this middleware makes
// localhost answer for them instead, so `npm run dev` is a fully
// offline rehearsal rig. Populate with `npm run sync-demos`.
function demoSnapshots() {
  const handler = (req, res, next) => {
    if (!req.url.startsWith("/roundhouse/")) return next();
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const rel = urlPath.replace("/roundhouse/", "");
    const root = join(process.cwd(), "demos/roundhouse");
    let file = join(root, rel);
    if (existsSync(file) && statSync(file).isDirectory()) {
      // Match Pages behavior: directories redirect to trailing slash
      // (relative asset URLs resolve wrongly without it).
      if (!urlPath.endsWith("/")) {
        res.statusCode = 301;
        res.setHeader("Location", urlPath + "/");
        return res.end();
      }
      file = join(file, "index.html");
    }
    if (!existsSync(file)) {
      // SPA fallback: a reloaded deep link (/roundhouse/blog/articles/1)
      // serves the shell, mirroring live Pages' 404.html bounce.
      if (rel.startsWith("blog/") && !extname(file)) {
        file = join(root, "blog/index.html");
      }
      if (!existsSync(file)) {
        res.statusCode = 404;
        return res.end("demo snapshot missing — run: npm run sync-demos");
      }
    }
    res.setHeader(
      "Content-Type",
      MIME[extname(file)] || "application/octet-stream",
    );
    res.end(readFileSync(file));
  };
  return {
    name: "demo-snapshots",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    // Also serve demos under `vite preview`, so previewing the built
    // deck exercises the demo slides too.
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({ command }) => ({
  // Project Pages serve under /dqor-2026/; dev stays at / so the
  // /roundhouse/ middleware paths line up with production's.
  base: command === "build" ? "/dqor-2026/" : "/",
  plugins: [demoSnapshots()],
}));
