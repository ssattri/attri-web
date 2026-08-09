import { mkdir, copyFile, cp, writeFile } from "node:fs/promises";
await mkdir("dist/hostinger/server", { recursive: true });
await cp("dist/server", "dist/hostinger/server", { recursive: true, force: true });
await copyFile("server-hostinger.mjs", "dist/hostinger/server.js");
await writeFile("dist/server.js", 'import "./hostinger/server.js";\n', "utf8");
