import { useState } from "react";
import { Validator } from "@cfworker/json-schema";
import { Receipt } from "@versaprotocol/schema";

type InitialValidator = null | Validator;

const getValidator = async (schemaVersion: string) => {
  if (!schemaVersion.match(/^\d+\.\d+\.\d+$/)) {
    return null;
  }
  const schemaUrl = `/GITHUB_CONTENT_URL/versa-protocol/schema/${schemaVersion}/data/receipt.schema.json`;
  const schema = await (await fetch(schemaUrl)).text();
  try {
    return new Validator(JSON.parse(schema));
  } catch {
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
