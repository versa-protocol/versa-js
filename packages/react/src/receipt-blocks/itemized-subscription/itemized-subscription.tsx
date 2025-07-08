import { formatDateTime } from "@versa/belt";
import styles from "./itemized-subscription.module.css";
import { Header, Subscription } from "@versa/schema";

export function ItemizedSubscription({
  subscription,
  header,
}: {
  subscription: Subscription;
  header: Header;
}) {
  return (
    <div className={styles.subscriptionWrap}>
      {subscription.subscription_items.map((s: any, index: number) => (
        <React.Fragment key={index}>
          {s.subscription_type == "recurring" && (
            <div className={styles.subscriptionNote}>
              Your subscription was renewed for your team of {s.quantity}. Your
              next bill will be on{" "}
              {formatDateTime(s.current_period_end_at, {
                iataTimezone: header.location?.address?.tz,
              })}
              .
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
