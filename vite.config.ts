import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CODEX_CONTEXT_ROUTE = "/__codex-context/frame";
const CODEX_CONTEXT_ROOT = resolve(process.cwd(), "dev/codex-context");
const CODEX_CONTEXT_FRAMES_DIR = join(CODEX_CONTEXT_ROOT, "frames");
const CODEX_CONTEXT_LATEST_FILE = join(CODEX_CONTEXT_ROOT, "latest-frame.json");
const CODEX_CONTEXT_INDEX_FILE = join(CODEX_CONTEXT_ROOT, "frame-index.json");

const sanitizeRouteToken = (routePath: string | undefined): string => {
  if (!routePath || routePath === "/") return "home";

  return routePath
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/\//g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "route";
};

const sanitizeTimestampToken = (timestamp: string | undefined): string => {
  const fallback = new Date().toISOString();
  return (timestamp ?? fallback).replace(/[:.]/g, "-");
};

const readRequestBody = async (request: NodeJS.ReadableStream): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
};

const readFrameIndex = async (): Promise<{
  latestJsonPath?: string;
  frames?: Array<{
    createdAt?: string;
    pagePath?: string;
    archiveJsonPath?: string;
    suggestedMarkdownPath?: string;
    componentCount?: number;
  }>;
}> => {
  try {
    const raw = await readFile(CODEX_CONTEXT_INDEX_FILE, "utf8");
    return JSON.parse(raw) as {
      latestJsonPath?: string;
      frames?: Array<{
        createdAt?: string;
        pagePath?: string;
        archiveJsonPath?: string;
        suggestedMarkdownPath?: string;
        componentCount?: number;
      }>;
    };
  } catch {
    return {};
  }
};

const codexContextFrameSavePlugin = () => ({
  name: "codex-context-frame-save",
  configureServer(server: {
    middlewares: {
      use: (
        path: string,
        handler: (
          req: NodeJS.ReadableStream & { method?: string },
          res: {
            statusCode: number;
            setHeader: (name: string, value: string) => void;
            end: (body: string) => void;
          },
          next: () => void,
        ) => void,
      ) => void;
    };
  }) {
    server.middlewares.use(CODEX_CONTEXT_ROUTE, (req, res, next) => {
      if (req.method !== "POST") {
        next();
        return;
      }

      void (async () => {
        try {
          const rawBody = await readRequestBody(req);
          const report = JSON.parse(rawBody) as {
            kind?: string;
            createdAt?: string;
            page?: { path?: string };
            selection?: { viewportPosition?: { anchor?: string } };
            components?: unknown[];
          };

          if (report.kind !== "codex-selection-context") {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid codex selection context payload." }));
            return;
          }

          await mkdir(CODEX_CONTEXT_FRAMES_DIR, { recursive: true });

          const routeToken = sanitizeRouteToken(report.page?.path);
          const timestampToken = sanitizeTimestampToken(report.createdAt);
          const baseName = `${timestampToken}--${routeToken}`;
          const archiveJsonPath = join(CODEX_CONTEXT_FRAMES_DIR, `${baseName}.json`);
          const suggestedMarkdownPath = join(CODEX_CONTEXT_FRAMES_DIR, `${baseName}.md`);
          const reportJson = `${JSON.stringify(report, null, 2)}\n`;

          await writeFile(archiveJsonPath, reportJson, "utf8");
          await writeFile(CODEX_CONTEXT_LATEST_FILE, reportJson, "utf8");

          const existingIndex = await readFrameIndex();
          const nextEntry = {
            createdAt: report.createdAt ?? new Date().toISOString(),
            pagePath: report.page?.path ?? "/",
            viewportAnchor: report.selection?.viewportPosition?.anchor ?? "unknown",
            componentCount: Array.isArray(report.components) ? report.components.length : 0,
            archiveJsonPath: relative(process.cwd(), archiveJsonPath),
            suggestedMarkdownPath: relative(process.cwd(), suggestedMarkdownPath),
          };
          const previousFrames = Array.isArray(existingIndex.frames) ? existingIndex.frames : [];
          const frames = [nextEntry, ...previousFrames.filter((entry) => entry.archiveJsonPath !== nextEntry.archiveJsonPath)].slice(0, 60);
          const indexPayload = {
            latestJsonPath: relative(process.cwd(), CODEX_CONTEXT_LATEST_FILE),
            frames,
          };

          await writeFile(CODEX_CONTEXT_INDEX_FILE, `${JSON.stringify(indexPayload, null, 2)}\n`, "utf8");

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              archiveJsonPath: relative(process.cwd(), archiveJsonPath),
              latestJsonPath: relative(process.cwd(), CODEX_CONTEXT_LATEST_FILE),
              suggestedMarkdownPath: relative(process.cwd(), suggestedMarkdownPath),
              indexPath: relative(process.cwd(), CODEX_CONTEXT_INDEX_FILE),
            }),
          );
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : "Failed to save codex selection context.",
            }),
          );
        }
      })();
    });
  },
});

export default defineConfig({
  plugins: [react(), codexContextFrameSavePlugin()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      onwarn(warning, warn) {
        const isKnownThreeMeshBvhWarning =
          warning.code === "MISSING_EXPORT" &&
          typeof warning.message === "string" &&
          warning.message.includes('"BatchedMesh" is not exported by "node_modules/three/build/three.module.js"') &&
          typeof warning.id === "string" &&
          warning.id.includes("three-mesh-bvh/src/utils/ExtensionUtilities.js");

        if (isKnownThreeMeshBvhWarning) {
          return;
        }

        warn(warning);
      },
    },
  },
});
