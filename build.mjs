import fs from "node:fs";
import path from "node:path";
import http from "node:http";
const pages = ["index.html", ...(fs.existsSync("en.html") ? ["en.html"] : [])];
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const file = match[1];
    if (/^(https?:|tel:|mailto:)/.test(file)) continue;
    if (!fs.existsSync(file)) throw Error("Missing asset: " + file);
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g))
    if (!html.includes('id="' + m[1] + '"'))
      throw Error("Missing anchor " + m[1]);
}
fs.mkdirSync("dist", { recursive: true });
for (const file of [
  ...pages,
  "styles.css",
  "app.js",
  "favicon.svg",
  "CREDITS.md",
])
  fs.copyFileSync(file, path.join("dist", file));
fs.cpSync("assets", "dist/assets", { recursive: true });
console.log(
  "Production build passed: " +
    pages.length +
    " page(s), assets and anchors validated.",
);
if (process.argv.includes("--serve"))
  http
    .createServer((req, res) => {
      const f = path.resolve(
        "dist",
        "." +
          decodeURIComponent(
            req.url.split("?")[0] === "/"
              ? "/index.html"
              : req.url.split("?")[0],
          ),
      );
      if (!f.startsWith(path.resolve("dist") + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      try {
        res.setHeader(
          "Content-Type",
          {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "text/javascript",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
            ".md": "text/plain",
          }[path.extname(f)] || "application/octet-stream",
        );
        res.end(fs.readFileSync(f));
      } catch {
        res.writeHead(404).end("Not found");
      }
    })
    .listen(4173, () => console.log("http://localhost:4173"));
