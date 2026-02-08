import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("react") || id.includes("scheduler")) {
            return "vendor-react";
          }

          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }

          if (id.includes("@react-three/fiber")) {
            return "vendor-r3f";
          }

          if (id.includes("/three/examples/")) {
            return "vendor-three-extras";
          }

          if (id.includes("/three/")) {
            return "vendor-three-core";
          }

          return "vendor-misc";
        },
      },
    },
  },
});
