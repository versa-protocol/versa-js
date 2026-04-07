import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  // marked@18 is ESM-only; bundle it so the CJS output stays self-contained
  noExternal: ["marked"],
});
