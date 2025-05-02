import styles from "./registry-data.module.css";
import { TEST_CHECKOUT } from "../../receipt/latest/receipt";
import { useState } from "react";
import { formatDateTime } from "@versaprotocol/belt";
import { X } from "react-feather";

export function RegistryData({ checkout }: { checkout: typeof TEST_CHECKOUT }) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      {isOpened && (
        <div className={styles.backdrop}>
          <div className={styles.registryDataDialog}>
            <header>
              <h3>Transaction Details — Versa Registry</h3>
              <button
                onClick={() => setIsOpened(false)}
                className={styles.close}
              >
                <X />
              </button>
            </header>
            <article>
              <dl>
                <dt>Receipt ID</dt>
                <dd>{checkout.receipt_id}</dd>
                <dt>Transaction ID</dt>
                <dd>{checkout.transaction_id}</dd>
                <dt>Registered At</dt>
                <dd>{formatDateTime(checkout.registered_at)}</dd>
                <dt>Handle</dt>
                <dd>{checkout.handles.customer_email}</dd>
                <dt>Sender Name</dt>
                <dd>{checkout.sender.legal_name}</dd>
                <dt>Sender ID</dt>
                <dd>{checkout.sender.org_id}</dd>
                <dt>Sender Website</dt>
                <dd>{checkout.sender.website}</dd>
              </dl>
            </article>
          </div>
        </div>
      )}
      <div className={styles.registryDataBlock}>
        <button onClick={() => setIsOpened(true)}>
          Verified Sender: {checkout.sender.website}
        </button>
      </div>
    </>
  );
}
