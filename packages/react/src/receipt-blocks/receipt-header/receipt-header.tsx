import { formatDateTime, formatUSD } from "@versaprotocol/belt";
import styles from "./receipt-header.module.css";
import { Merchant, Receipt } from "@versaprotocol/schema";
import { Merchant as PlaceholderGraphic } from "../../icons/merchant";
import { Parties } from "../parties/parties";

export function ReceiptHeader({
  merchant,
  header,
  brandColor,
}: {
  merchant: Merchant;
  header: Receipt["header"];
  brandColor: string;
}) {
  return (
    <div className={styles.receiptHeader}>
      {/* Full Page */}

      <div className={styles.fullPage}>
        <div
          className={styles.brandStripe}
          style={{
            backgroundColor: brandColor,
          }}
        ></div>
        <h1>{header.total === header.paid ? "Receipt" : "Invoice"}</h1>
        <div className={styles.headerChunk}>
          {header.invoice_number && (
            <div>Invoice Number: {header.invoice_number}</div>
          )}
          <div>Date: {formatDateTime(header.invoiced_at)}</div>
        </div>
        {(header.customer || merchant.address) && (
          <Parties customer={header.customer} merchant={merchant} />
        )}

        <div className={styles.logo}>
          {merchant.logo && (
            <img
              src={
                (header.third_party &&
                  header.third_party.make_primary &&
                  header.third_party.merchant.logo) ||
                merchant.logo
              }
              width={96}
              height={96}
              alt={
                header.third_party && header.third_party.make_primary
                  ? header.third_party.merchant.name
                  : merchant.name
              }
            />
          )}
        </div>
      </div>

      {/* Compact */}
      <div className={styles.compact}>
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
    </div>
  );
}
