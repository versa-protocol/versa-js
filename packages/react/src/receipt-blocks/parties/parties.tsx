import { formatPhoneNumber } from "@versa/belt";
import styles from "./parties.module.css";
import { Org, Receipt } from "@versa/schema";
import { formatAddressMultiline } from "@versa/belt";

export function Parties({
  customer,
  merchant,
}: {
  customer: Receipt["header"]["customer"];
  merchant: Org;
}) {
  return (
    <div className={styles.partiesWrap}>
      {customer && (
        <div>
          <div className={styles.partyHeader}>Bill To</div>
          {customer.name && <div>{customer.name}</div>}
          {customer.email && <div>{customer.email}</div>}
          {customer.website && <div>{customer.website}</div>}
          {customer.phone && <div>{formatPhoneNumber(customer.phone)}</div>}
          {customer?.address &&
            formatAddressMultiline(customer.address)
              .split("\n")
              .map((line, i) => <div key={i}>{line}</div>)}
          {customer.metadata && customer.metadata.length > 0 && (
            <div className={styles.lineItemMetadata}>
              <>
                {customer.metadata.map((m: any, index: number) => (
                  <div key={index}>
                    {m.key && <>{m.key}: </>}
                    {m.value}
                  </div>
                ))}
              </>
            </div>
          )}
        </div>
      )}
      {merchant?.address && (
        <div>
          <div className={styles.partyHeader}>{merchant.name}</div>
          {formatAddressMultiline(merchant.address)
            .split("\n")
            .map((line, i) => (
              <div key={i}>{line}</div>
            ))}
        </div>
      )}
    </div>
  );
}
