// curl -o packages/schema/receipt.schema.json 'https://raw.githubusercontent.com/versa-protocol/schema/main/events/receipt.schema.json'
// pnpm --package=json-schema-to-typescript dlx json2ts packages/schema/receipt.schema.json > packages/schema/src/schema.ts --ignoreMinAndMaxItems --additionalProperties false
// git add packages/schema/src/schema.ts

const fs = require("fs");
const { compileFromFile } = require("json-schema-to-typescript");

const LTS_VERSIONS = require("./lts");

/**
 * The schemas we generate bindings for. `receipt` is treated specially: its
 * types are re-exported flat (for backwards compatibility), while the others
 * are namespaced to avoid collisions between their shared sub-types.
 */
const SCHEMAS = ["booking", "invoice", "itinerary", "receipt"];

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

async function main() {
  if (LTS_VERSIONS.length === 0) {
    throw new Error("No LTS versions found");
  }
  const latestVersion = LTS_VERSIONS[LTS_VERSIONS.length - 1];

  let index = "/* This file is auto-generated, do not modify */\n";

  // Start from a clean slate so stale per-version files don't linger.
  if (fs.existsSync("src/lts")) {
    fs.rmSync("src/lts", { recursive: true, force: true });
  }
  fs.mkdirSync("src/lts", { recursive: true });

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

/** Fetch a schema definition, returning null if it doesn't exist for this version. */
async function fetchSchema(
  schemaVersion: string,
  schemaName: string
): Promise<string | null> {
  // Schema files moved from /data/ to /events/ in version 2.3.0
  const dir = compareVersions(schemaVersion, "2.3.0") < 0 ? "data" : "events";
  const res = await fetch(
    `https://raw.githubusercontent.com/versa-protocol/schema/${schemaVersion}/${dir}/${schemaName}.schema.json`
  );
  if (!res.ok) {
    console.log(
      `Skipping ${schemaName} for version ${schemaVersion}: ${res.status}`
    );
    return null;
  }
  return await res.text();
}

async function generate(schemaVersion: string) {
  const versionDir = `src/lts/${schemaVersion}`;
  fs.mkdirSync(versionDir, { recursive: true });

  const generated: string[] = [];

  for (const schemaName of SCHEMAS) {
    const schema = await fetchSchema(schemaVersion, schemaName);
    if (schema === null) {
      continue;
    }

    const schemaFile = `${schemaName}.schema.json`;
    fs.writeFileSync(schemaFile, schema);

    const ts = await compileFromFile(schemaFile, {
      additionalProperties: false,
      ignoreMinAndMaxItems: true,
    });
    fs.writeFileSync(`${versionDir}/${schemaName}.ts`, ts);

    generated.push(schemaName);
  }

  // Re-export the generated schemas. `receipt` types are flattened for
  // backwards compatibility; every schema is also available namespaced.
  let versionIndex = "/* This file is auto-generated, do not modify */\n";
  if (generated.includes("receipt")) {
    versionIndex += `export * from "./receipt";\n`;
  }
  for (const schemaName of generated) {
    versionIndex += `export * as ${schemaName} from "./${schemaName}";\n`;
  }
  fs.writeFileSync(`${versionDir}/index.ts`, versionIndex);
}

main();
