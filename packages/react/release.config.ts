// rollup.config.js

import { bundleStats } from "rollup-plugin-bundle-stats";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    del({ targets: "dist/*", runOnce: true }),
    (peerDepsExternal as any)(),
    resolve({
      mainFields: ["module", "main"],
    }),
    typescript({ tsconfig: "tsconfig.build.json" }),
    commonjs({
      include: /node_modules/,
    }),
    postcss({
      modules: true,
      minimize: true,
    }),
    terser({
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }),
    bundleStats({ baseline: true }),
  ],
  external: ["react", "react-dom"],
};

export default config;
