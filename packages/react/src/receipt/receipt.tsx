import { lts, Org, Receipt } from "@versaprotocol/schema";
import { ReceiptDisplay as R_1_5_1 } from "./1.5.1/receipt";
import { ReceiptDisplay as R_1_6_0 } from "./1.6.0/receipt";
import { ReceiptLatest } from "./latest/receipt";

import { LTS_VERSIONS } from "@versaprotocol/schema";
import { Activity } from "@versaprotocol/belt";

export function ReceiptDisplay({
  receipt,
  merchant,
  activities,
  history,
  theme,
}: {
  receipt: Receipt;
  merchant: Org;
  activities?: Activity[];
  history?: Receipt[];
  theme?: string;
}) {
  const data = receipt;
  const schemaVersion = data.schema_version;

  if (!LTS_VERSIONS.includes(schemaVersion)) {
    return (
      <div>
        Receipt schema version {schemaVersion} is not supported by this display
        library.
      </div>
    );
  }

  if (schemaVersion === "1.5.1") {
    return (
      <R_1_5_1
        receipt={data as unknown as lts.v1_5_1.Receipt}
        schemaVersion={schemaVersion}
        merchant={merchant}
        activities={activities}
        theme={theme}
      />
    );
  }

  if (schemaVersion === "1.6.0") {
    return (
      <R_1_6_0
        receipt={data as unknown as lts.v1_6_0.Receipt}
        schemaVersion={schemaVersion}
        merchant={merchant}
        activities={activities}
        theme={theme}
      />
    );
  }

  // The 1.8.0 react display is compatible with 1.7.0

  return (
    <ReceiptLatest
      receipt={data}
      schemaVersion={schemaVersion}
      merchant={merchant}
      history={history}
      theme={theme}
    />
  );
}
