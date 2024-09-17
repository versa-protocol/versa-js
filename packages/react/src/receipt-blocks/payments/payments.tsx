import { formatDateTime, formatUSD } from "@versaprotocol/belt";
import styles from "./payments.module.css";
import { Payment, Receipt } from "@versaprotocol/schema";

function prettyNetwork(network: string) {
  if (network == "mastercard") {
    return "MasterCard";
  }
  if (network == "visa") {
    return "Visa";
  }
  return network;
}

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
                <>{prettyNetwork(payments[0].card_payment.network)}</>
              )}
              <span className={styles.lastFour}>
                ··· {payments[0].card_payment?.last_four}
              </span>
            </div>
          )}
          <div>{formatDateTime(payments[0].paid_at, true, true)}</div>
        </div>
      ) : (
        <>
          {payments.map((payment, i) => (
            <div className={styles.payment} key={i}>
              {payment.payment_type == "card" && (
                <div className={styles.paymentType}>
                  <div>
                    {payment.card_payment?.network && (
                      <>{prettyNetwork(payment.card_payment.network)}</>
                    )}
                    <span className={styles.lastFour}>
                      ··· {payment.card_payment?.last_four}
                    </span>
                  </div>
                  <div className={styles.date}>
                    {formatDateTime(payment.paid_at, true, true)}
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
