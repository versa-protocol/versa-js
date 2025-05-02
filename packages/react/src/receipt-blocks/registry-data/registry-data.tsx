import styles from "./registry-data.module.css";
import { TEST_CHECKOUT } from "../../receipt/latest/receipt";
import { formatDateTime } from "@versaprotocol/belt";
import { X } from "react-feather";
import { Receipt } from "@versaprotocol/schema";
import { useState } from "react";

export function RegistryData({
  checkout,
  receipt,
}: {
  checkout: typeof TEST_CHECKOUT;
  receipt: Receipt;
}) {
  const [isOpened, setIsOpened] = useState(false);

  function downloadJsonFile(): void {
    const jsonString: string = JSON.stringify(receipt, null, 2);
    const blob: Blob = new Blob([jsonString], { type: "application/json" });
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      checkout.sender.name +
      " Invoice " +
      epochToISO8601(receipt.header.invoiced_at) +
      ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function epochToISO8601(epochTime: number): string {
    const date = new Date(epochTime * 1000);
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const day: string = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
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
                <dt>Source</dt>
                <dd>
                  <button
                    onClick={() => downloadJsonFile()}
                    className={styles.ddLink}
                  >
                    Download JSON
                  </button>
                </dd>
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
