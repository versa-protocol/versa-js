// curl -o packages/schema/receipt.schema.json 'https://raw.githubusercontent.com/versa-protocol/schema/main/data/receipt.schema.json'
// pnpm --package=json-schema-to-typescript dlx json2ts packages/schema/receipt.schema.json > packages/schema/src/schema.ts --ignoreMinAndMaxItems --additionalProperties false
// git add packages/schema/src/schema.ts

const fs = require("fs");
const { compileFromFile } = require("json-schema-to-typescript");

async function main() {
  const res = await fetch(
    "https://raw.githubusercontent.com/versa-protocol/schema/main/data/receipt.schema.json"
  );
  const schema = await res.text();

  fs.writeFileSync("receipt.schema.json", schema);

  // compile from file
  compileFromFile("receipt.schema.json", {
    additionalProperties: false,
    ignoreMinAndMaxItems: true,
  }).then((ts: string) => fs.writeFileSync("src/schema.ts", ts));
}

main();
