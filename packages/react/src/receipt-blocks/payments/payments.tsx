import { formatDateTime } from "@versaprotocol/belt";
import styles from "./payments.module.css";
import { Payment } from "@versaprotocol/schema";

function prettyNetwork(network: string) {
  if (network == "mastercard") {
    return "MasterCard";
  }
  if (network == "visa") {
    return "Visa";
  }
  return network;
}

export function Payments({ payments }: { payments: Payment[] }) {
  return (
    <div className={styles.paymentsWrap}>
      {payments.map((payment, i) => (
        <div className={styles.payment} key={i}>
          {payment.payment_type == "card" && (
            <div className={styles.paymentType}>
              {payment.card_payment?.network && (
                <>{prettyNetwork(payment.card_payment.network)}</>
              )}
              <> ··· {payment.card_payment?.last_four}</>
            </div>
          )}
          <div>{formatDateTime(payment.paid_at, true, true)}</div>
        </div>
      ))}
    </div>
  );
}
