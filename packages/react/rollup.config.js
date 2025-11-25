// rollup.config.js

const { bundleStats } = require("rollup-plugin-bundle-stats");
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const resolve = require("@rollup/plugin-node-resolve").default;
const typescript = require("@rollup/plugin-typescript");

module.exports = [
  // ES Module build
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      json(),
      typescript({ tsconfig: "tsconfig.build.json" }),
      commonjs(),
      postcss({
        modules: true,
      }),
      bundleStats({ baseline: true }),
    ],
    external: ["react", "react-dom"],
  },
  // UMD build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "VersaReact",
      exports: "named",
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react/jsx-runtime": "jsxRuntime",
      },
      inlineDynamicImports: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      json(),
      typescript({
        tsconfig: "tsconfig.build.json",
        declaration: false,
        declarationMap: false,
      }),
      commonjs(),
      postcss({
        modules: true,
        inject: true,
      }),
    ],
    external: ["react", "react-dom"],
  },
];
