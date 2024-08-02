import { formatDateTime, formatUSD } from "@versaprotocol/belt";
import styles from "./receipt-header.module.css";
// import Image from "next/image";
import { Merchant, Receipt } from "versa_unstable_sdk";
import { Merchant as PlaceholderGraphic } from "../../icons/merchant";

export function ReceiptHeader({
  merchant,
  header,
}: {
  merchant: Merchant;
  header: Receipt["header"];
}) {
  return (
    <div className={styles.receiptHeader}>
      <div className={styles.logo}>
        {merchant.logo ? (
          <img
            src={
              (header.third_party &&
                header.third_party.make_primary &&
                header.third_party.merchant.logo) ||
              merchant.logo
            }
            width={64}
            height={64}
            alt={
              header.third_party && header.third_party.make_primary
                ? header.third_party.merchant.name
                : merchant.name
            }
          />
        ) : (
          <PlaceholderGraphic />
        )}
      </div>
      <div className={styles.headerText}>
        <h1>{formatUSD(header.total / 100)}</h1>
        <div className="secondaryText">
          {header.third_party && header.third_party.make_primary ? (
            <>
              {header.third_party.merchant.name} (via {merchant.name}){" "}
            </>
          ) : (
            <>{merchant.name} </>
          )}
          &nbsp;·&nbsp; {formatDateTime(header.invoiced_at)}
        </div>
      </div>
    </div>
  );
}
