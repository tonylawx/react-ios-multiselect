import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "node:fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "radix-ui", "lucide-react", "clsx"],
  // Ship the plain (non-module) stylesheet as dist/aapl-select.css so consumers
  // do `import "react-ios-multiselect/style.css"`. The class names referenced in
  // src/styles.ts are stable global names, so no CSS-Modules hashing is needed.
  // The stylesheet is intentionally NOT imported from the JS entry: consumers
  // opt in by importing the subpath themselves (keeps the global CSS explicit).
  async onSuccess() {
    mkdirSync("dist", { recursive: true });
    copyFileSync("src/aapl-select.css", "dist/aapl-select.css");
  },
});

