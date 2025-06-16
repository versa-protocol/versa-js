import { formatDateTime } from "@versaprotocol/belt";
import styles from "../../../../receipt-blocks/itemized-subscription/itemized-subscription.module.css";
import { lts } from "@versaprotocol/schema";

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
        <>
          {s.subscription_type == "recurring" && (
            <div className={styles.subscriptionNote} key={index}>
              Your subscription was renewed for your team of {s.quantity}. Your
              next bill will be on{" "}
              {formatDateTime(s.current_period_end, {
                iataTimezone: header.location?.address?.tz,
              })}
              .
            </div>
          )}
        </>
      ))}
    </div>
  );
}
