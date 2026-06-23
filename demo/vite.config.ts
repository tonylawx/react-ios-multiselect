import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The demo imports the package via `file:..`. To get instant HMR on source
// edits (instead of rebuilding dist on every change), alias the package to its
// src entry.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-ios-multiselect/style.css": new URL(
        "../src/aapl-select.css",
        import.meta.url
      ).pathname,
      "react-ios-multiselect": new URL("../src/index.ts", import.meta.url).pathname,
    },
  },
});
