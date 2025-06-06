import { formatDateTime, formatUSD } from "@versaprotocol/belt";
import styles from "./payments.module.css";
import { Payment } from "@versaprotocol/schema";

import { lts } from "@versaprotocol/schema";
type Receipt = lts.v1_9_0.Receipt;

export function Payments({
  payments,
  header,
}: {
  payments: Payment[];
  header: Receipt["header"];
}) {
  return (
    <div>
      {payments.length == 1 && payments[0].amount == header.total ? (
        <div className={styles.payment}>
          {payments[0].payment_type == "card" && (
            <div className={styles.paymentType}>
              {payments[0].card_payment?.network && (
                <>{toTitleCase(payments[0].card_payment.network)}</>
              )}
              <span className={styles.lastFour}>
                ··· {payments[0].card_payment?.last_four}
              </span>
            </div>
          )}
          <div>
            {formatDateTime(payments[0].paid_at, {
              includeTime: true,
              iataTimezone: header.location?.address?.tz || null,
              includeTimezone: true,
            })}
          </div>
        </div>
      ) : (
        <>
          {payments.map((payment, i) => (
            <div className={styles.payment} key={i}>
              {payment.payment_type == "card" && (
                <div className={styles.paymentType}>
                  <div>
                    {payment.card_payment?.network && (
                      <>{toTitleCase(payment.card_payment.network)}</>
                    )}
                    <span className={styles.lastFour}>
                      ··· {payment.card_payment?.last_four}
                    </span>
                  </div>
                  <div className={styles.date}>
                    {formatDateTime(payment.paid_at, {
                      includeTime: true,
                      iataTimezone: header.location?.address?.tz || null,
                      includeTimezone: true,
                    })}
                  </div>
                </div>
              )}
              <div>{formatUSD(payment.amount / 100)}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// Helpers

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
