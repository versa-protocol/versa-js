import { useState } from "react";
import { Validator } from "@cfworker/json-schema";
import { Receipt } from "@versaprotocol/schema";

type InitialValidator = null | Validator;

type GitTagResponse = {
  ref: string;
  node_id: string;
  url: string;
  object: {
    sha: string;
    type: string;
    url: string;
  };
};

const getBestGitTagForVersion = async (
  version: string
): Promise<string | null> => {
  try {
    // First check if exact version exists
    const response = await fetch(
      `/GITHUB_API_URL/repos/versa-protocol/schema/git/refs/tags/${version}`
    );
    if (!response.ok) {
      return null;
    }

    const matchingTags: GitTagResponse[] = await response.json();

    for (const tag of matchingTags) {
      if (tag.ref === `refs/tags/${version}`) {
        return version;
      }
    }
    // If exact version not found, find the latest RC
    let latestRC: { version: string; num: number } | null = null;

    for (const tag of matchingTags) {
      const tagName = tag.ref.replace("refs/tags/", "");
      const rcMatch = tagName.match(new RegExp(`^${version}-rc(\\d+)$`));

      if (rcMatch) {
        const rcNum = parseInt(rcMatch[1]);
        if (!latestRC || rcNum > latestRC.num) {
          latestRC = { version: tagName, num: rcNum };
        }
      }
    }

    if (latestRC) {
      return latestRC.version;
    }

    // Return original version if no alternatives found
    return version;
  } catch {
    return version;
  }
};

const getValidator = async (schemaVersion: string) => {
  if (!schemaVersion.match(/^\d+\.\d+\.\d+(-rc\d+)?$/)) {
    return null;
  }

  // Get the best available version (exact or most recent RC)
  const versionToUse = await getBestGitTagForVersion(schemaVersion);

  if (!versionToUse) {
    return null;
  }

  if (versionToUse !== schemaVersion) {
    console.log(
      `Version ${schemaVersion} not found, using ${versionToUse} instead`
    );
  }

  const schemaUrl = `/GITHUB_CONTENT_URL/versa-protocol/schema/${versionToUse}/data/receipt.schema.json`;
  try {
    const response = await fetch(schemaUrl);
    if (!response.ok) return null;
    const schema = await response.json();
    return new Validator(schema);
  } catch (e) {
    return null;
  }
};

export const useValidator = () => {
  const [previousSchemaVersion, setPreviousSchemaVersion] = useState<
    string | null
  >(null);
  const [validator, setValidator] = useState<InitialValidator>(null);
  const validate = async (obj: Receipt) => {
    const schemaVersion = obj.schema_version;
    if (schemaVersion === previousSchemaVersion && !!validator) {
      return validator.validate(obj);
    }
    setPreviousSchemaVersion(schemaVersion);
    const newValidator = await getValidator(schemaVersion);
    if (!newValidator) {
      if (validator) {
        // use previous validator if available
        // (meaning it was initialized correctly with a previous schema version)
        return validator.validate(obj);
      }
      return {
        valid: true,
        errors: [],
      };
    }
    setValidator(newValidator);
    return newValidator.validate(obj);
  };

  return { validate };
};
