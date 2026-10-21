/// <reference types="node" />
// Dev-plugin som lar API-et "lagre" til meals.json.
//
// Workeren (workerd) har ikke tilgang til disken, men Vite kjører i Node og har det.
// Workeren sender derfor hele måltidslisten hit (PUT /__dev/meals), og pluginen
// skriver den til src/features/storage/meals.json. Virker bare under `pnpm dev`.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const STORAGE_DIR = "src/features/storage";

export function devJsonStorage(): Plugin {
  let target = "";

  return {
    name: "dev-json-storage",
    apply: "serve",

    // Uten dette ville hver lagring laste workeren på nytt og nullstille minnet.
    config() {
      return { server: { watch: { ignored: [`**/${STORAGE_DIR}/**`] } } };
    },

    configResolved(config) {
      target = path.resolve(config.root, STORAGE_DIR, "meals.json");
    },

    configureServer(server) {
      server.middlewares.use("/__dev/meals", (req, res) => {
        if (req.method !== "PUT") {
          res.statusCode = 405;
          res.end();
          return;
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            if (!Array.isArray(data)) throw new Error("Forventet en liste");
            await writeFile(target, JSON.stringify(data, null, 2) + "\n", "utf8");
            res.statusCode = 204;
            res.end();
          } catch (err) {
            res.statusCode = 400;
            res.end(err instanceof Error ? err.message : "Ugyldig data");
          }
        });
      });
    },
  };
}
