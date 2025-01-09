import { useEffect, useState } from "react";
import { Validator } from "@cfworker/json-schema";

type InitialValidator = null | Validator;

let validator: InitialValidator = null;

const getValidator = async (schemaVersion: string) => {
  if (validator) {
    return validator;
  }
  const schemaUrl = `/GITHUB_CONTENT_URL/versa-protocol/schema/${schemaVersion}/data/receipt.schema.json`;
  const schema = await (await fetch(schemaUrl)).text();
  validator = new Validator(JSON.parse(schema));
  return validator;
};

export const useValidator = (schemaVersion: string) => {
  const [validator, setValidator] = useState<InitialValidator>();
  useEffect(() => {
    (async function () {
      const v = await getValidator(schemaVersion);
      setValidator(v);
    })();
  }, [setValidator, schemaVersion]);
  return { validator };
};
