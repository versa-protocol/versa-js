import {
  capitalize,
  formatTransactionValue,
  netAdjustments,
} from "@versa/belt";
import styles from "./line-item.module.css";
import { Adjustment, Item, Metadatum, Receipt } from "@versa/schema";
import React, { useState } from "react";
import { ChevronDown } from "react-feather";

export function LineItem({
  li,
  header,
}: {
  li: Item;
  header: Receipt["header"];
}) {
  const [showAllMetadata, setShowAllMetadata] = useState(false);
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
          <div>
            {li.url ? (
              <a href={li.url} target="_blank" rel="noopener noreferrer">
                {li.description}
              </a>
            ) : (
              li.description
            )}
          </div>
          <div className={styles.lineItemDetails}>
            <div className={styles.lineItemMetadata}>
              {li.metadata && li.metadata.length > 0 && (
                <>
                  {showAllMetadata ? (
                    <>
                      {li.metadata.map((m: Metadatum, index: number) => (
                        <div key={index} className="secondaryText">
                          {m.key && <>{m.key}: </>}
                          {m.value}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="secondaryText">
                        {li.metadata[0].key && <>{li.metadata[0].key}: </>}
                        {li.metadata[0].value}
                      </div>
                      {li.metadata.length > 1 && (
                        <div className="secondaryText">
                          <button
                            className={styles.chevronButton}
                            onClick={() => setShowAllMetadata(true)}
                            aria-label="Show all metadata"
                            type="button"
                          >
                            <span>More</span>
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {li.unit_cost && (
                <div>
                  {li.quantity}
                  {li.unit && <> {li.unit}s</>} x{" "}
                  {formatTransactionValue(li.unit_cost, header.currency)}
                  {li.unit && <> per {li.unit}</>}
                </div>
              )}
              {li.adjustments && li.adjustments.length > 0 && (
                <>
                  {li.adjustments.map((a: Adjustment, index: number) => (
                    <div key={index} className="secondaryText">
                      {a.name
                        ? a.name
                        : capitalize(
                            a.adjustment_type.replaceAll("_", " ")
                          )}{" "}
                      {a.rate ? (
                        <>({a.rate * 100}%)</>
                      ) : (
                        <>
                          ({formatTransactionValue(a.amount, header.currency)})
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className={styles.totalWrap}>
              {li.adjustments && li.adjustments.length > 0 && (
                <div className={styles.adjustmentCalc}>
                  {formatTransactionValue(
                    li.amount - netAdjustments(li.adjustments),
                    header.currency
                  )}
                </div>
              )}
              <div className={styles.lineItemTotal}>
                {formatTransactionValue(li.amount, header.currency)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.lineItemTextSimple}>
          <div className={styles.description}>
            {li.url ? (
              <a href={li.url} target="_blank" rel="noopener noreferrer">
                {li.description}
              </a>
            ) : (
              li.description
            )}
          </div>
          <div className={styles.lineItemTotal}>
            {formatTransactionValue(li.amount, header.currency)}
          </div>
        </div>
      )}
    </div>
  );
}
