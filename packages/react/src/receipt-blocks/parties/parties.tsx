import styles from "./parties.module.css";
import { Receipt } from "@versaprotocol/schema";

export function Parties({ header }: { header: Receipt["header"] }) {
  return (
    <div className={styles.partiesWrap}>
      {header.customer && (
        <>
          <div className={styles.partyHeader}>Bill To</div>
          {header.customer.name && <div>{header.customer.name}</div>}
          {header.customer.email && <div>{header.customer.email}</div>}
          {header.customer.phone && <div>{header.customer.phone}</div>}
          {header.customer?.address && (
            <>
              {header.customer.address.street_address && (
                <div>{header.customer.address.street_address}</div>
              )}
              {(header.customer.address.city ||
                header.customer.address.region ||
                header.customer.address.postal_code) && (
                <div>
                  {header.customer.address.city && (
                    <span>{header.customer.address.city}, </span>
                  )}
                  {header.customer.address.region && (
                    <span>{header.customer.address.region} </span>
                  )}
                  {header.customer.address.postal_code && (
                    <span>{header.customer.address.postal_code}</span>
                  )}
                </div>
              )}
              {header.customer.address.country && (
                <div>{header.customer.address.country}</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
