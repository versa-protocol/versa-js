import { Download } from "react-feather";
import styles from "./export-options.module.css";
import { Header } from "@versaprotocol/schema";

export function ExportOptions({
  mapAttribution,
  receiptHeader,
  downloadReceipt,
}: {
  mapAttribution: boolean;
  receiptHeader: Header;
  downloadReceipt: () => void;
}) {
  return (
    <>
      {receiptHeader.paid > 0 && (
        <div className={styles.finePrintWrap}>
          {Boolean(
            receiptHeader.invoice_asset_id || receiptHeader.receipt_asset_id
          ) ? (
            <div className={styles.downloadBlock}>
              {Boolean(receiptHeader.invoice_asset_id) && (
                <a
                  href={`https://registry.versa.org/asset/${receiptHeader.invoice_asset_id}`}
                >
                  <Download size={16} /> <div>Download Invoice</div>
                </a>
              )}
              {Boolean(receiptHeader.receipt_asset_id) && (
                <a
                  href={`https://registry.versa.org/asset/${receiptHeader.receipt_asset_id}`}
                >
                  <Download size={16} /> <div>Download Receipt</div>
                </a>
              )}
            </div>
          ) : (
            <div className={styles.downloadBlock}>
              <button onClick={() => downloadReceipt()}>
                <Download size={16} /> <div>Download Receipt</div>
              </button>
            </div>
          )}

          {/* {mapAttribution && (
        <div className={styles.finePrintContent}>
          <div className={styles.mapAttribution}>
            <span className={styles.mapLabel}>Maps:</span>
            <ul>
              <li>
                © <a href="https://www.mapbox.com/about/maps/">Mapbox</a>
              </li>
              <li>
                ©{" "}
                <a href="http://www.openstreetmap.org/copyright">
                  OpenStreetMap
                </a>
              </li>
              <li>
                <a href="https://www.mapbox.com/map-feedback/" target="_blank">
                  Improve map
                </a>
              </li>
            </ul>
          </div>
        </div>
      )} */}
        </div>
      )}
    </>
  );
}
