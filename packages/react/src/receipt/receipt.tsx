import { lts, Org, Receipt } from "@versa/schema";
// import { ReceiptDisplay as R_1_5_1 } from "./1.5.1/receipt";
// import { ReceiptDisplay as R_1_6_0 } from "./1.6.0/receipt";
import { ReceiptDisplay as R_1_11_0 } from "./1.11.0/receipt";
import { ReceiptLatest } from "./latest/receipt";

import { LTS_VERSIONS } from "@versa/schema";
import { compareSchemaVersions } from "@versa/belt";
import { RegistryData } from "../model";

export function ReceiptDisplay({
  receipt,
  merchant,
  theme,
  registryData,
}: {
  receipt: Receipt;
  merchant: Org;
  theme?: string;
  registryData?: RegistryData;
}) {
  const data = receipt;
  const schemaVersion = data.schema_version;

  if (!LTS_VERSIONS.includes(schemaVersion)) {
    if (
      compareSchemaVersions(
        LTS_VERSIONS[LTS_VERSIONS.length - 1],
        schemaVersion
      ) === 1
    ) {
      // Should possibly 'fall back' to the oldest LTS version component tree? (as opposed to the latest)
      // eslint-disable-next-line no-console
      console.warn(
        `WARN: Received schema version that has been retired; contact Versa support if this is a recent receipt. (Received version: ${schemaVersion})`
      );
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `WARN: Received schema version that is newer than the latest supported version; update your Versa library at your earliest convenience. (Received version: ${schemaVersion})`
      );
    }
  }

  // Support for 1.11.0 and earlier versions with string passenger
  if (
    schemaVersion === "1.11.0" ||
    schemaVersion === "1.10.0" ||
    schemaVersion === "1.9.0" ||
    schemaVersion === "1.8.0"
  ) {
    return (
      <R_1_11_0
        receipt={data as unknown as lts.v1_11_0.Receipt}
        schemaVersion={schemaVersion}
        merchant={merchant}
        theme={theme}
        registryData={registryData}
      />
    );
  }

  // 2.1.0 and later use the latest component with Person type support
  return (
    <ReceiptLatest
      receipt={data}
      schemaVersion={schemaVersion}
      merchant={merchant}
      theme={theme}
      registryData={registryData}
    />
  );
}
