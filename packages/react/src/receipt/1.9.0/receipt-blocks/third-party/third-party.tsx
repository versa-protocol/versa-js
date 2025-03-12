import styles from "./third-party.module.css";
import { Org } from "@versaprotocol/schema";
import { lts } from "@versaprotocol/schema";

export function ThirdParty({
  third_party,
  merchant,
}: {
  third_party: lts.v1_9_0.Receipt["header"]["third_party"];
  merchant: Org;
}) {
  return (
    <>
      {third_party && (
        <div className={styles.thirdPartyWrap}>
          <div className={styles.description}>
            {third_party.merchant.name} delivery via {merchant.name}
          </div>
          {third_party.merchant.logo && (
            <div className={styles.logo}>
              <img
                src={third_party.merchant.logo}
                width={48}
                height={48}
                alt={third_party.merchant.name}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
