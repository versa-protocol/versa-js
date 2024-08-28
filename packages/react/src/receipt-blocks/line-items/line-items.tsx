import styles from "./line-items.module.css";
import { LineItem } from "./../line-item";
import { Item } from "@versaprotocol/schema";
import { groupItems, someItemsGrouped } from "@versaprotocol/belt";
import React from "react";

export function LineItems({ items }: { items: Item[] }) {
  const hasGroupField = someItemsGrouped(items);
  const groupedItems = groupItems(items);
  return (
    <div className={styles.lineItemsWrap}>
      {hasGroupField ? (
        <div className={styles.lineItemsInner}>
          {Object.keys(groupedItems).map((group: any) => (
            <React.Fragment key={group}>
              <div className={styles.groupTitle}>{group}</div>
              {groupedItems[group]?.map((li: any, index: number) => (
                <LineItem li={li} key={index} />
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className={styles.lineItemsInner}>
          {items.map((li: any, index: number) => (
            <LineItem li={li} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
