import { formatDateTime } from "@versa/belt";
import styles from "./itemized-subscription.module.css";
import { Header, Subscription } from "@versa/schema";
import React from "react";
import { BlockWrap } from "../block-wrap";

export function ItemizedSubscription({
  subscription,
  header,
}: {
  subscription: Subscription;
  header: Header;
}) {
  return (
    <>
      {subscription.subscription_items.length === 1 &&
        subscription.subscription_items.map((s: any, index: number) => (
          <React.Fragment key={index}>
            {s.subscription_type == "recurring" && (
              <BlockWrap>
                <div className={styles.subscriptionNote}>
                  Your subscription was renewed for your team of {s.quantity}.
                  Your next bill will be on{" "}
                  {formatDateTime(s.current_period_end_at, {
                    iataTimezone: header.location?.address?.tz,
                  })}
                  .
                </div>
              </BlockWrap>
            )}
            {s.subscription_type == "one_time" &&
              s.current_period_start_at &&
              s.current_period_end_at && (
                <BlockWrap>
                  <div className={styles.dateRange}>
                    <div className={styles.start}>
                      <div className={styles.header}>From</div>
                      <div className={styles.time}>
                        {formatDateTime(s.current_period_start_at, {
                          iataTimezone: header.location?.address?.tz || null,
                        })}
                      </div>
                    </div>
                    <div className={styles.end}>
                      <div className={styles.header}>To</div>
                      <div className={styles.time}>
                        {formatDateTime(s.current_period_end_at, {
                          iataTimezone: header.location?.address?.tz || null,
                        })}
                      </div>
                    </div>
                  </div>
                </BlockWrap>
              )}
          </React.Fragment>
        ))}
    </>
  );
}
