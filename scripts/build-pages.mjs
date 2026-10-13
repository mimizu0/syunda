#!/usr/bin/env node
/**
 * GitHub Pages static export.
 *
 * Nitro's github-pages preset prerenders `/` then fails while building a
 * leftover SSR environment (Vite 8). If index.html landed, we finish the
 * public folder ourselves: copy SSR CSS, 404.html, .nojekyll, BASE_PATH.
 */
import { spawn } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, ".output/public");
const SSR_ASSETS = join(ROOT, "node_modules/.nitro/vite/services/ssr/assets");

function pagesBase() {
  const raw = (process.env.BASE_PATH ?? "/").trim() || "/";
  if (raw === "./") return "./";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function rewriteBase(html, base) {
  if (!base || base === "/") return html;
  return html
    .replaceAll('"/assets/', `"${base}assets/`)
    .replaceAll("'/assets/", `'${base}assets/`)
    .replaceAll('href="/favicon', `href="${base}favicon`)
    .replaceAll('href="/__grok', `href="${base}__grok`);
}

function finish() {
  const indexPath = join(PUBLIC_DIR, "index.html");
  if (!existsSync(indexPath)) {
    console.error("[build:pages] missing .output/public/index.html");
    process.exit(1);
  }

  mkdirSync(join(PUBLIC_DIR, "assets"), { recursive: true });
  let html = readFileSync(indexPath, "utf8");

  for (const match of html.matchAll(/\/assets\/(styles-[^"' ]+\.css)/g)) {
    const name = match[1];
    const dest = join(PUBLIC_DIR, "assets", name);
    if (existsSync(dest)) continue;
    const src = join(SSR_ASSETS, name);
    if (existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`[build:pages] copied ${name}`);
    } else {
      const fallback = readdirSync(join(PUBLIC_DIR, "assets")).find((f) => f.endsWith(".css"));
      if (fallback) {
        html = html.replaceAll(name, fallback);
        console.log(`[build:pages] rewrote ${name} → ${fallback}`);
      }
    }
  }

  const base = pagesBase();
  html = rewriteBase(html, base);
  writeFileSync(indexPath, html);
  copyFileSync(indexPath, join(PUBLIC_DIR, "404.html"));
  writeFileSync(join(PUBLIC_DIR, ".nojekyll"), "");
  console.log(`[build:pages] ready ${PUBLIC_DIR} (base ${base})`);
}

process.env.PAGES = "1";

const child = spawn("node", ["scripts/with-app-env.mjs", "vite", "build"], {
  cwd: ROOT,
  stdio: "inherit",
  env: process.env,
});

child.on("close", (code) => {
  if (!existsSync(join(PUBLIC_DIR, "index.html"))) {
    process.exit(code || 1);
  }
  if (code !== 0) {
    console.warn("[build:pages] vite exited", code, "— using prerendered public/");
  }
  try {
    finish();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
