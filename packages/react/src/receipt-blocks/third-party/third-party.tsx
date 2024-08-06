import styles from "./third-party.module.css";
import { Merchant, Receipt } from "versa_unstable_sdk";

export function ThirdParty({
  third_party,
  merchant,
}: {
  third_party: Receipt["header"]["third_party"];
  merchant: Merchant;
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
