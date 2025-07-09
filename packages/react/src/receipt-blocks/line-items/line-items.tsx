import styles from "./line-items.module.css";
import { LineItem } from "./../line-item";
import { Item, Receipt } from "@versa/schema";
import {
  groupItems,
  someItemsGrouped,
  someItemsWithDate,
  sortItemsByDate,
} from "@versa/belt";
import React from "react";

export function LineItems({
  items,
  header,
}: {
  items: Item[];
  header: Receipt["header"];
}) {
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
                    <LineItem
                      li={li}
                      key={index}
                      header={header}
                      url={li.url}
                    />
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
                    <LineItem
                      li={li}
                      key={index}
                      header={header}
                      url={li.url}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.lineItemsInner}>
          {items.map((li: any, index: number) => (
            <LineItem li={li} key={index} header={header} url={li.url} />
          ))}
        </div>
      )}
    </div>
  );
}
