import styles from "./broken-receipt.module.css";
import { BrokenReceiptSvg } from "./broken-receipt-svg";

export function BrokenReceipt() {
  return (
    <div className={styles.wrap}>
      <BrokenReceiptSvg width={240} height={240} aria-label="broken receipt" />
    </div>
  );
}
