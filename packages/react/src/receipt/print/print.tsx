import { Org, Receipt } from "@versaprotocol/schema";
import { ReceiptDisplay } from "./../receipt";
import styles from "./print.module.css";

export type CompositeReceipt = {
  receipt: Receipt;
  merchant: Org;
};

export type CollapsedReceipt = Receipt & { merchant: Org };

export function Print({
  data,
  onClose,
}: {
  data: CompositeReceipt;
  onClose: () => void;
}) {
  return (
    <div className={styles.printWrap}>
      <ReceiptDisplay merchant={data.merchant} receipt={data.receipt} />
      <ul className={styles.fullScreenActions}>
        <li>
          <button>Download PDF</button>
        </li>
        <li>
          <button>Download CSV</button>
        </li>
        <li>
          <button
            onClick={() => {
              window.print();
            }}
          >
            Print
          </button>
        </li>
        <li>
          <button onClick={() => onClose()}>Close</button>
        </li>
      </ul>
    </div>
  );
}
