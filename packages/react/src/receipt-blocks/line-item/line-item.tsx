import { capitalize, formatUSD, netAdjustments } from "@versaprotocol/belt";
import styles from "./line-item.module.css";
import { Adjustment, Item, Metadatum } from "@versaprotocol/schema";

export function LineItem({ li }: { li: Item }) {
  return (
    <div className={li.unit_cost ? styles.lineItem : styles.lineItemCompact}>
      {li.product_image_asset_id && (
        <img
          src={`https://registry.versa.org/asset/${li.product_image_asset_id}`}
          width={64}
          height={64}
          alt={li.description}
          className={styles.lineItemPhoto}
        />
      )}
      {li.unit_cost ||
      (li.metadata && li.metadata.length > 0) ||
      (li.adjustments && li.adjustments.length > 0) ? (
        <div className={styles.lineItemText}>
          <div>{li.description}</div>
          <div className={styles.lineItemDetails}>
            <div className={styles.lineItemMetadata}>
              {li.metadata && li.metadata.length > 0 && (
                <>
                  {li.metadata.map((m: Metadatum, index: number) => (
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
              {li.adjustments && li.adjustments.length > 0 && (
                <>
                  {li.adjustments.map((a: Adjustment, index: number) => (
                    <div className="secondaryText">
                      {a.name ? a.name : capitalize(a.adjustment_type)}{" "}
                      {a.rate ? (
                        <>({a.rate * 100}%)</>
                      ) : (
                        <>({formatUSD(a.amount / 100)})</>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className={styles.totalWrap}>
              {li.adjustments && li.adjustments.length > 0 && (
                <div className={styles.adjustmentCalc}>
                  {formatUSD(
                    (li.amount - netAdjustments(li.adjustments)) / 100
                  )}
                </div>
              )}
              <div className={styles.lineItemTotal}>
                {formatUSD(li.amount / 100)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.lineItemTextSimple}>
          <div className={styles.description}>{li.description}</div>
          <div className={styles.lineItemTotal}>
            {formatUSD(li.amount / 100)}
          </div>
        </div>
      )}
    </div>
  );
}
