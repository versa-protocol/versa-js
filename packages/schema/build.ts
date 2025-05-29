// curl -o packages/schema/receipt.schema.json 'https://raw.githubusercontent.com/versa-protocol/schema/main/data/receipt.schema.json'
// pnpm --package=json-schema-to-typescript dlx json2ts packages/schema/receipt.schema.json > packages/schema/src/schema.ts --ignoreMinAndMaxItems --additionalProperties false
// git add packages/schema/src/schema.ts

const fs = require("fs");
const { compileFromFile } = require("json-schema-to-typescript");

const LTS_VERSIONS = require("./lts");

async function main() {
  if (LTS_VERSIONS.length === 0) {
    throw new Error("No LTS versions found");
  }
  const latestVersion = LTS_VERSIONS[LTS_VERSIONS.length - 1];

  let index = "/* This file is auto-generated, do not modify */\n";

  if (!fs.existsSync("src/lts")) {
    fs.mkdirSync("src/lts", { recursive: true });
  }

  for (const version of LTS_VERSIONS) {
    const safeVersion = version.replace(/\./g, "_").replace(/-/g, "_");
    await generate(version);
    index += `export * as v${safeVersion} from "./${version}";\n`;
  }

  fs.writeFileSync(`src/lts/index.ts`, index);

  fs.writeFileSync(
    `src/index.ts`,
    `/* This file is auto-generated, do not modify */
export * as lts from "./lts";

/* Always re-export the latest version directly */
export * from "./lts/${latestVersion}";

/* And finally export a list of LTS versions */
export const LTS_VERSIONS = ${JSON.stringify(LTS_VERSIONS)};
`
  );
}

async function generate(schemaVersion: string) {
  const res = await fetch(
    `https://raw.githubusercontent.com/versa-protocol/schema/${schemaVersion}/data/receipt.schema.json`
  );
  const schema = await res.text();

  fs.writeFileSync("receipt.schema.json", schema);

  // compile from file
  compileFromFile("receipt.schema.json", {
    additionalProperties: false,
    ignoreMinAndMaxItems: true,
  }).then((ts: string) => fs.writeFileSync(`src/lts/${schemaVersion}.ts`, ts));
}

main();
