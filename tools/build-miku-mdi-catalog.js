const fs = require("fs");
const path = require("path");

const root = process.cwd();
const sourceDir = path.join(root, "tmp", "mdi-svg-extract", "package", "svg");
const outDir = path.join(root, "www", "hatsune-miku-icons", "all-material-icons");
const outFile = path.join(outDir, "icons-data.js");

function extractPath(svg) {
  const match = svg.match(/<path\s+[^>]*d="([^"]+)"/);
  return match ? match[1] : "";
}

const files = fs.readdirSync(sourceDir)
  .filter((file) => file.endsWith(".svg"))
  .sort((a, b) => a.localeCompare(b));

const icons = files.map((file) => {
  const name = path.basename(file, ".svg");
  const svg = fs.readFileSync(path.join(sourceDir, file), "utf8");
  return { name, path: extractPath(svg) };
}).filter((icon) => icon.path);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outFile,
  `window.MIKU_MDI_ICONS = ${JSON.stringify(icons)};\n`,
  "utf8",
);

console.log(`Wrote ${icons.length} icons to ${outFile}`);
