import styles from "./third-party.module.css";
import { Org, Receipt } from "@versa/schema";

export function ThirdParty({
  third_party,
  merchant,
}: {
  third_party: Receipt["header"]["third_party"];
  merchant: Org;
}) {
  if (!third_party) return null;

  const boxLogo = third_party.make_primary
    ? merchant.logo
    : third_party.merchant?.logo;
  const boxLogoAlt = third_party.make_primary
    ? merchant.name
    : third_party.merchant?.name;

  return (
    <div className={styles.thirdPartyWrap}>
      <div className={styles.description}>
        {third_party.merchant?.name || "Third party"} via {merchant.name}
      </div>
      {boxLogo && (
        <div className={styles.logo}>
          <img src={boxLogo} width={48} height={48} alt={boxLogoAlt} />
        </div>
      )}
    </div>
  );
}
