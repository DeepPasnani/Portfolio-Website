import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Deliberately separate from vite.config.ts: that file is owned by the
// @lovable.dev/vite-tanstack-config preset (see the warning comment there)
// and isn't meant to carry test-runner config.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
  },
});
