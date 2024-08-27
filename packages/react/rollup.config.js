// rollup.config.js

const postcss = require("rollup-plugin-postcss");
const typescript = require("@rollup/plugin-typescript");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const del = require("rollup-plugin-delete");

const packageJson = require("./package.json");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      // interop: "compat",
      dir: "dist",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    del({ targets: "dist/*" }),
    peerDepsExternal(),
    resolve(),
    typescript(),
    commonjs(),
    postcss({
      modules: true,
    }),
  ],
};
