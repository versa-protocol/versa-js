import type { Config } from "jest";

const config: Config = {
  globalSetup: "./jestSetup.ts",
  preset: "ts-jest",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Note that this is no longer bundled in jest
  // jest-environment-jsdom must be installed separately
  testEnvironment: "jsdom",
};

export default config;
