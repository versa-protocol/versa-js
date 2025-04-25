import { lts, Org, Receipt } from "@versaprotocol/schema";
// import { ReceiptDisplay as R_1_5_1 } from "./1.5.1/receipt";
// import { ReceiptDisplay as R_1_6_0 } from "./1.6.0/receipt";
import { ReceiptLatest } from "./latest/receipt";

import { LTS_VERSIONS } from "@versaprotocol/schema";
import { compareSchemaVersions } from "./schemaVersion";

export function ReceiptDisplay({
  receipt,
  merchant,
  theme,
}: {
  receipt: Receipt;
  merchant: Org;
  theme?: string;
}) {
  const data = receipt;
  let schemaVersion = data.schema_version;

  if (!LTS_VERSIONS.includes(schemaVersion)) {
    if (
      compareSchemaVersions(
        LTS_VERSIONS[LTS_VERSIONS.length - 1],
        schemaVersion
      ) === 1
    ) {
      // Should possibly 'fall back' to the oldest LTS version component tree? (as opposed to the latest)
      console.warn(
        `WARN: Received schema version that has been retired; contact Versa support if this is a recent receipt. (Received version: ${schemaVersion})`
      );
    } else {
      console.warn(
        `WARN: Received schema version that is newer than the latest supported version; update your Versa library at your earliest convenience. (Received version: ${schemaVersion})`
      );
    }
  }

  // if (schemaVersion === "1.5.1") {
  //   return (
  //     <R_1_5_1
  //       receipt={data as unknown as lts.v1_5_1.Receipt}
  //       schemaVersion={schemaVersion}
  //       merchant={merchant}
  //       theme={theme}
  //     />
  //   );
  // }

  // if (schemaVersion === "1.6.0") {
  //   return (
  //     <R_1_6_0
  //       receipt={data as unknown as lts.v1_6_0.Receipt}
  //       schemaVersion={schemaVersion}
  //       merchant={merchant}
  //       theme={theme}
  //     />
  //   );
  // }

  // The 1.8.0 react display is compatible with 1.7.0

  return (
    <ReceiptLatest
      receipt={data}
      schemaVersion={schemaVersion}
      merchant={merchant}
      theme={theme}
    />
  );
}
