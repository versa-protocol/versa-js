import styles from "./parties.module.css";
import { Org, Receipt } from "@versaprotocol/schema";

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
          {customer.phone && <div>{customer.phone}</div>}
          {customer?.address && (
            <>
              {customer.address.street_address && (
                <div>{customer.address.street_address}</div>
              )}
              {(customer.address.city ||
                customer.address.region ||
                customer.address.postal_code) && (
                <div>
                  {customer.address.city && (
                    <span>{customer.address.city}, </span>
                  )}
                  {customer.address.region && (
                    <span>{customer.address.region} </span>
                  )}
                  {customer.address.postal_code && (
                    <span>{customer.address.postal_code}</span>
                  )}
                </div>
              )}
              {customer.address.country && (
                <div>{customer.address.country}</div>
              )}
            </>
          )}
          {customer.metadata.length > 0 && (
            <div className={styles.lineItemMetadata}>
              <>
                {customer.metadata.map((m: any, index: number) => (
                  <div>
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
          {(merchant.address.city ||
            merchant.address.region ||
            merchant.address.postal_code) && (
            <div>
              {merchant.address.city && <span>{merchant.address.city}, </span>}
              {merchant.address.region && (
                <span>{merchant.address.region} </span>
              )}
              {merchant.address.postal_code && (
                <span>{merchant.address.postal_code}</span>
              )}
            </div>
          )}
          {merchant.address.country && <div>{merchant.address.country}</div>}
        </div>
      )}
    </div>
  );
}
