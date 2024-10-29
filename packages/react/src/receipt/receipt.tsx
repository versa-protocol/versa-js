import { Org, Receipt } from "@versaprotocol/schema";
import { ReceiptDisplay as R_1_5_1 } from "./1.5.1/receipt";

import { LTS_VERSIONS } from "@versaprotocol/schema";
import { Activity } from "@versaprotocol/belt";

export function ReceiptDisplay({
  receipt,
  merchant,
  activities,
  theme,
}: {
  receipt: Receipt;
  merchant: Org;
  activities?: Activity[];
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

  return (
    <R_1_5_1
      receipt={data}
      schemaVersion={schemaVersion}
      merchant={merchant}
      activities={activities}
      theme={theme}
    />
  );
}
