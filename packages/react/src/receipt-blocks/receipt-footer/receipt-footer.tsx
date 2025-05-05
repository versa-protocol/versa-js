import { Download, Shield, X } from "react-feather";
import styles from "./receipt-footer.module.css";
import { Receipt } from "@versaprotocol/schema";
import { TEST_CHECKOUT } from "../../receipt/latest/receipt";
import { useState } from "react";
import { epochToISO8601, formatDateTime } from "@versaprotocol/belt";

export function ReceiptFooter({
  mapAttribution,
  receipt,
  downloadReceipt,
  checkout,
}: {
  mapAttribution: boolean;
  receipt: Receipt;
  downloadReceipt: () => void;
  checkout: typeof TEST_CHECKOUT;
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

  return (
    <>
      {receipt.header.paid > 0 && (
        <div className={styles.finePrintWrap}>
          {Boolean(
            receipt.header.invoice_asset_id || receipt.header.receipt_asset_id
          ) ? (
            <div className={styles.downloadBlock}>
              {Boolean(receipt.header.invoice_asset_id) && (
                <a
                  href={`https://registry.versa.org/asset/${receipt.header.invoice_asset_id}`}
                >
                  <Download size={16} /> <div>Download Invoice</div>
                </a>
              )}
              {Boolean(receipt.header.receipt_asset_id) && (
                <a
                  href={`https://registry.versa.org/asset/${receipt.header.receipt_asset_id}`}
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

          {isOpened && (
            <div className={styles.backdrop}>
              <div className={styles.registryDataDialog}>
                <div className={styles.buttons}>
                  <button
                    onClick={() => setIsOpened(false)}
                    className={styles.close}
                  >
                    <X />
                  </button>
                </div>
                <header>
                  <h3>Transaction Details</h3>
                  <div className={styles.subheader}>Versa Registry</div>
                </header>
                <article>
                  <dl>
                    <dt>Receipt ID</dt>
                    <dd>{checkout.receipt_id}</dd>
                    <dt>Transaction ID</dt>
                    <dd>{checkout.transaction_id}</dd>
                    <dt>Registered At</dt>
                    <dd>{formatDateTime(checkout.registered_at)}</dd>
                    {checkout.handles.customer_email && (
                      <>
                        <dt>Handle</dt>
                        <dd>{checkout.handles.customer_email}</dd>
                      </>
                    )}
                    <dt>Sender Name</dt>
                    <dd>
                      {checkout.sender.legal_name || checkout.sender.name}
                    </dd>
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
                        Raw JSON
                      </button>
                    </dd>
                  </dl>
                </article>
              </div>
            </div>
          )}
          <div className={styles.downloadBlock}>
            <button onClick={() => setIsOpened(true)}>
              <div>Sender: {checkout.sender.website}</div>
            </button>
          </div>

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
