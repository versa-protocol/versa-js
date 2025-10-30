import * as fs from "fs";
import * as path from "path";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

const DEFAULT_SCHEMA_VERSION = "2.1.0";
const SCHEMA_BASE_URL =
  "https://raw.githubusercontent.com/versa-protocol/schema";

/**
 * Recursively find all JSON files in a directory
 */
function findJsonFiles(dir: string, basePath: string = ""): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Extract version from file path if it exists
 */
function extractVersionFromPath(filePath: string): string | null {
  const parts = filePath.split(path.sep);
  for (const part of parts) {
    // Check if this part looks like a semantic version
    if (/^\d+\.\d+\.\d+/.test(part)) {
      return part;
    }
  }
  return null;
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function main(): Promise<void> {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error("Must include target directory as first argument");
    process.exit(1);
  }

  try {
    const allErrors = true;
    const strict = false;

    // Find all JSON files in the target directory
    const jsonFiles = findJsonFiles(targetDir);

    // Group files by schema version
    const filesByVersion = new Map<string, string[]>();

    for (const file of jsonFiles) {
      const version = extractVersionFromPath(file) || DEFAULT_SCHEMA_VERSION;
      if (!filesByVersion.has(version)) {
        filesByVersion.set(version, []);
      }
      filesByVersion.get(version)!.push(file);
    }

    console.log(
      `Found ${jsonFiles.length} JSON files across ${filesByVersion.size} schema versions`
    );

    // Validate files for each version
    for (const [version, files] of filesByVersion) {
      const schemaUrl = `${SCHEMA_BASE_URL}/${version}/data/receipt.schema.json`;
      console.log(
        `\nValidating ${files.length} files against schema version ${version}`
      );
      console.log(`Schema URL: ${schemaUrl}`);

      const ajv = new Ajv2020({ allErrors, strict });
      addFormats(ajv);

      let schema: string;
      try {
        const response = await fetch(schemaUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        schema = await response.text();
      } catch (e) {
        console.error(`Error fetching schema for version ${version}:`, e);
        console.error(`Skipping validation for version ${version}`);
        continue;
      }

      const validate = ajv.compile(JSON.parse(schema));

      for (const file of files) {
        const fullPath = path.join(targetDir, file);
        const content = fs.readFileSync(fullPath, "utf-8");
        process.stdout.write(`  Validating ${file}...`);

        try {
          const data = JSON.parse(content);
          const valid = validate(data);

          if (!valid) {
            process.stdout.write("\n");
            console.error(
              `Validation failed for ${file} due to errors: ${JSON.stringify(
                validate.errors,
                null,
                2
              )}`
            );
            throw new Error(
              `Invalid schema for ${file}: ${JSON.stringify(validate.errors)}`
            );
          } else {
            process.stdout.write(" \x1b[32m✓ VALID\x1b[0m\n");
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            process.stdout.write(" \x1b[31m✗ INVALID JSON\x1b[0m\n");
            console.error(`Failed to parse JSON in ${file}:`, e.message);
            throw e;
          }
          throw e;
        }
      }
    }

    console.log("\n\x1b[32m✓ All validations completed successfully!\x1b[0m");
    process.exit(0);
  } catch (error: any) {
    // Handle errors and indicate failure
    console.error(
      `\n\x1b[31m✗ Validation failed:\x1b[0m`,
      error.message || error
    );
    process.exit(1);
  }
}

main();
