// rollup.config.js

const { bundleStats } = require("rollup-plugin-bundle-stats");
const commonjs = require("@rollup/plugin-commonjs");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const resolve = require("@rollup/plugin-node-resolve").default;
const typescript = require("@rollup/plugin-typescript");

module.exports = {
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
    peerDepsExternal(),
    resolve(),
    typescript({ tsconfig: "tsconfig.build.json" }),
    commonjs(),
    postcss({
      modules: true,
    }),
    bundleStats({ baseline: true }),
  ],
  external: ["react", "react-dom"],
};
