import { useEffect, useState } from "react";
import { Validator } from "@cfworker/json-schema";

const schemaUrl =
  "/GITHUB_CONTENT_URL/versa-protocol/schema/main/data/receipt.schema.json";

type InitialValidator = null | Validator;

let validator: InitialValidator = null;

const getValidator = async () => {
  if (validator) {
    return validator;
  }
  const schema = await (await fetch(schemaUrl)).text();
  validator = new Validator(JSON.parse(schema));
  return validator;
};

export const useValidator = () => {
  const [validator, setValidator] = useState<InitialValidator>();
  useEffect(() => {
    (async function () {
      const v = await getValidator();
      setValidator(v);
    })();
  }, [setValidator]);
  return { validator };
};
