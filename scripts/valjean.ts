import * as fs from "fs";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

const schemaUrl =
  "https://raw.githubusercontent.com/versa-protocol/schema/1.9.0/data/receipt.schema.json";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function main(): Promise<void> {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error("Must include target directory as first argument");
  }
  try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml

    const allErrors = true;
    const strict = false;

    const ajv = new Ajv2020({ allErrors, strict });
    addFormats(ajv);

    const targetDirs = targetDir.split(",");

    let schema: string;
    try {
      schema = await (await fetch(schemaUrl)).text();
    } catch (e) {
      console.error("Error fetching schema: ", e);
      throw e;
    }
    console.log("Validating against schema found at", schemaUrl);
    const validate = ajv.compile(JSON.parse(schema));
    for (const targetDir of targetDirs) {
      const files = fs
        .readdirSync(targetDir, { withFileTypes: true })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);
      for (const file of files) {
        const content = fs.readFileSync(`${targetDir}/${file}`, "utf-8");
        process.stdout.write(`Validating ${targetDir}/${file}...`);
        const valid = validate(JSON.parse(content));
        if (!valid) {
          process.stdout.write("\n");
          console.error(
            `Validation failed for ${targetDir}/${file} due to errors: ${JSON.stringify(
              validate.errors,
              null,
              2
            )}`
          );
          throw "Invalid schema: " + JSON.stringify(validate.errors);
        } else {
          process.stdout.write("\x1b[34mVALID\x1b[89m");
          process.stdout.write("\x1b[0m");
          process.stdout.write("\n");
        }
      }
    }

    const time = new Date().toTimeString();
    process.stdout.write("\n\x1b[34mValidation Completed!\x1b[89m\n");
    process.exit(0);
  } catch (error: any) {
    // Handle errors and indicate failure
    console.error(`Failed due to validation error:`, error);
    process.exit(1);
  }
}

main();
