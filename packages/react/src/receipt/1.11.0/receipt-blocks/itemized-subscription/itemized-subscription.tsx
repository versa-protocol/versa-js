import { formatDateTimeWithPlaces } from "@versa/belt";
import styles from "../../../../receipt-blocks/itemized-subscription/itemized-subscription.module.css";
import { lts } from "@versa/schema";
import React from "react";

export function ItemizedSubscription({
  subscription,
  header,
}: {
  subscription: lts.v1_11_0.Subscription;
  header: lts.v1_11_0.Header;
}) {
  return (
    <div className={styles.subscriptionWrap}>
      {subscription.subscription_items.map((s: any, index: number) => (
        <React.Fragment key={index}>
          {s.subscription_type == "recurring" && (
            <div className={styles.subscriptionNote}>
              Your subscription was renewed for your team of {s.quantity}. Your
              next bill will be on{" "}
              {formatDateTimeWithPlaces(s.current_period_end, [
                header.location,
              ])}
              .
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
