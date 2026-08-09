import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const candidatePaths = [
  resolve(__dirname, "dist/hostinger/server.js"),
  resolve(__dirname, "dist/server.js"),
];

const serverPath = candidatePaths.find((path) => existsSync(path));

if (!serverPath) {
  throw new Error(
    "Hostinger server artifact not found. Run `npm run build:hostinger` before starting the app."
  );
}

await import(serverPath);
