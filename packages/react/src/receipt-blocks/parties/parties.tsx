import { formatPhoneNumber } from "@versa/belt";
import styles from "./parties.module.css";
import { Org, Receipt } from "@versa/schema";
import { formatAddress } from "@versa/belt";

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
          {customer?.address && (
            <>
              {customer.address.street_address && (
                <div>{customer.address.street_address}</div>
              )}
              {(() => {
                const line = formatAddress(customer.address, {
                  includeStreet: false,
                  includeCountry: false,
                  includePostalCode: true,
                });
                return line ? <div>{line}</div> : null;
              })()}
              {customer.address.country && (
                <div>{customer.address.country}</div>
              )}
            </>
          )}
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
          {merchant.address.street_address && (
            <div>{merchant.address.street_address}</div>
          )}
          {(() => {
            const line = formatAddress(merchant.address, {
              includeStreet: false,
              includeCountry: false,
              includePostalCode: true,
            });
            return line ? <div>{line}</div> : null;
          })()}
          {merchant.address.country && <div>{merchant.address.country}</div>}
        </div>
      )}
    </div>
  );
}
