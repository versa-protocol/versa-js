import { formatUSD } from "@versaprotocol/belt";
import styles from "./line-items.module.css";
import { LineItem } from "./../line-item";
import { ItemMetadata } from "@versaprotocol/schema";
import { groupItems, someItemsGrouped } from "@versaprotocol/belt";
import React from "react";

interface BaseItem {
  description: string;
  total: number;
  quantity?: null | number;
  unit_cost?: null | number;
  unit?: null | string;
  metadata?: null | ItemMetadata[];
  product_image?: null | string;
  group?: null | string;
  url?: null | string;
}

function Item({ li }: { li: BaseItem }) {
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
      {li.unit_cost ? (
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
              <div>
                {li.quantity}
                {li.unit && <> {li.unit}s</>} x {formatUSD(li.unit_cost / 100)}
                {li.unit && <> per {li.unit}</>}
              </div>
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

export function LineItems({ items }: { items: BaseItem[] }) {
  const hasGroupField = someItemsGrouped(items);
  const groupedItems = groupItems(items);
  return (
    <div className={styles.lineItemsWrap}>
      {hasGroupField ? (
        <table className={styles.lineItemReg}>
          <>
            {Object.keys(groupedItems).map((group: any) => (
              <React.Fragment key={group}>
                <div className={styles.groupTitle}>{group}</div>
                {groupedItems[group]?.map((li: any, index: number) => (
                  <LineItem li={li} key={index} />
                ))}
              </React.Fragment>
            ))}
          </>
        </table>
      ) : (
        <table className={styles.lineItemReg}>
          {items.map((li: any, index: number) => (
            <LineItem li={li} key={index} />
          ))}
        </table>
      )}
    </div>
  );
}
