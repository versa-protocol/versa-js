import { formatUSD } from "@versaprotocol/belt";
import styles from "./lineItem.module.css";
// import Image from "next/image";

export function LineItem({ li }: { li: any }) {
  return (
    <div className={styles.lineItem}>
      {li.product_image && (
        <img
          src={li.product_image}
          width={64}
          height={64}
          alt={li.description}
          className={styles.lineItemPhoto}
        />
      )}
      {li.unit_cost || (li.metadata && li.metadata.length > 0) ? (
        <div className={styles.lineItemText}>
          <div>{li.description}</div>
          <div className={styles.lineItemDetails}>
            <div className={styles.lineItemMetadata}>
              {li.metadata && li.metadata.length > 0 && (
                <>
                  {li.metadata.map((m: any, index: number) => (
                    <div className="secondaryText">
                      {m.key && <>{m.key}: </>}
                      {m.value}
                    </div>
                  ))}
                </>
              )}
              {li.unit_cost && (
                <div>
                  {li.quantity}
                  {li.unit && <> {li.unit}s</>} x{" "}
                  {formatUSD(li.unit_cost / 100)}
                  {li.unit && <> per {li.unit}</>}
                </div>
              )}
            </div>
            <div className={styles.lineItemTotal}>
              {formatUSD(li.total / 100)}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.lineItemTextSimple}>
          <div className={styles.description}>{li.description}</div>
          <div className={styles.lineItemTotal}>
            {formatUSD(li.total / 100)}
          </div>
        </div>
      )}
    </div>
  );
}
