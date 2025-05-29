import { Download, X } from "react-feather";
import styles from "../../../../receipt-blocks/receipt-footer/receipt-footer.module.css";
import { lts } from "@versaprotocol/schema";
import { useState } from "react";
import { epochToISO8601, formatDateTime } from "@versaprotocol/belt";
import { RegistryData } from "../../../../model";

export function ReceiptFooter({
  mapAttribution: _mapAttribution,
  receipt,
  downloadReceipt,
  registryData,
}: {
  mapAttribution: boolean;
  receipt: lts.v1_11_0.Receipt;
  downloadReceipt: () => void;
  registryData?: RegistryData;
}) {
  const [isOpened, setIsOpened] = useState(false);

  function downloadJsonFile(): void {
    if (!registryData) {
      return;
    }
    const jsonString: string = JSON.stringify(receipt, null, 2);
    const blob: Blob = new Blob([jsonString], { type: "application/json" });
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      registryData.sender.name +
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
          {receipt.header.invoice_asset_id ||
          receipt.header.receipt_asset_id ? (
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

          {isOpened && !!registryData && (
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
                    <dd>{registryData.receipt_id}</dd>
                    <dt>Transaction ID</dt>
                    <dd>{registryData.transaction_id}</dd>
                    <dt>Registered At</dt>
                    <dd>{formatDateTime(registryData.registered_at)}</dd>
                    {registryData.handles.customer_email && (
                      <>
                        <dt>Handle</dt>
                        <dd>{registryData.handles.customer_email}</dd>
                      </>
                    )}
                    <dt>Sender Name</dt>
                    <dd>
                      {registryData.sender.legal_name ||
                        registryData.sender.name}
                    </dd>
                    <dt>Sender ID</dt>
                    <dd>{registryData.sender.org_id}</dd>
                    <dt>Sender Website</dt>
                    <dd>{registryData.sender.website}</dd>
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
          {!!registryData && (
            <div className={styles.registryBlock}>
              <button onClick={() => setIsOpened(true)}>
                <div>Versa Registry: {registryData.sender.website}</div>
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
