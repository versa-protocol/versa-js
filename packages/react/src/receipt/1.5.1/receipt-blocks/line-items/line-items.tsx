import styles from "./line-items.module.css";
import { LineItem } from "./../line-item";
import { lts } from "@versaprotocol/schema";
import { lts_v1_5_1 } from "@versaprotocol/belt";
import React from "react";

const { groupItems, someItemsGrouped, someItemsWithDate, sortItemsByDate } =
  lts_v1_5_1;

export function LineItems({ items }: { items: lts.v1_5_1.Item[] }) {
  const hasGroupField = someItemsGrouped(items);
  const groupedItems = groupItems(items);
  const hasDateField = someItemsWithDate(items);
  const sortedItemsByDate = sortItemsByDate(items);
  return (
    <div className={styles.lineItemsWrap}>
      {hasGroupField || hasDateField ? (
        <>
          {hasDateField ? (
            <div className={styles.lineItemsInner}>
              {Object.keys(sortedItemsByDate).map((date: any) => (
                <React.Fragment key={date}>
                  <div className={styles.groupTitle}>{date}</div>
                  {sortedItemsByDate[date]?.map((li: any, index: number) => (
                    <LineItem li={li} key={index} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          ) : (
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
          )}
        </>
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
