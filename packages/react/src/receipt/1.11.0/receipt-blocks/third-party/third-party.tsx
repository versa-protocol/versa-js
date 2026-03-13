import styles from "../../../../receipt-blocks/third-party/third-party.module.css";
import { lts } from "@versa/schema";

export function ThirdParty({
  third_party,
  merchant,
}: {
  third_party: lts.v1_11_0.Receipt["header"]["third_party"];
  merchant: lts.v1_11_0.Org;
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
