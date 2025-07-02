import { formatDateTime, formatTransactionValue } from "@versa/belt";
import styles from "../../../../receipt-blocks/receipt-header/receipt-header.module.css";
import { lts } from "@versa/schema";
import { Merchant as PlaceholderGraphic } from "../../../../icons/merchant";
import { Parties } from "../parties/parties";

export function ReceiptHeader({
  merchant,
  header,
  brandColor,
}: {
  merchant: lts.v1_11_0.Org;
  header: lts.v1_11_0.Receipt["header"];
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
        <div className={styles.fullPageInner}>
          <div className={styles.fullPageData}>
            <h1>{header.total === header.paid ? "Receipt" : "Invoice"}</h1>
            <div className={styles.headerChunk}>
              {header.invoice_number && (
                <div>Invoice Number: {header.invoice_number}</div>
              )}
              <div>
                Date:{" "}
                {formatDateTime(header.invoiced_at, {
                  iataTimezone: header.location?.address?.tz || null,
                })}
              </div>
            </div>
            {(header.customer || merchant.address) && (
              <Parties customer={header.customer} merchant={merchant} />
            )}
          </div>
          {merchant.logo && (
            <div className={styles.logo}>
              <img
                src={
                  (header.third_party &&
                    header.third_party.make_primary &&
                    header.third_party.merchant?.logo) ||
                  merchant.logo
                }
                width={96}
                height={96}
                alt={
                  header.third_party && header.third_party.make_primary
                    ? header.third_party.merchant?.name
                    : merchant.name
                }
              />
            </div>
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
                  header.third_party.merchant?.logo) ||
                merchant.logo
              }
              width={64}
              height={64}
              alt={
                header.third_party && header.third_party.make_primary
                  ? header.third_party.merchant?.name
                  : merchant.name
              }
            />
          ) : (
            <div className={styles.logo}>
              <PlaceholderGraphic />
            </div>
          )}
        </div>
        <div className={styles.headerText}>
          <h1>{formatTransactionValue(header.total, header.currency)}</h1>
          <div className="secondaryText">
            {header.third_party && header.third_party.make_primary ? (
              <>
                {header.third_party.merchant?.name} (via {merchant.name}){" "}
              </>
            ) : (
              <>{merchant.name} </>
            )}
            &nbsp;·&nbsp;{" "}
            {formatDateTime(header.invoiced_at, {
              iataTimezone: header.location?.address?.tz || null,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
