import { formatDateTime } from "@versaprotocol/belt";
import styles from "./fullscreen-header.module.css";

export function FullscreenHeader({
  merchant,
  thirdParty,
  amount,
  created,
  brandColor,
}: {
  merchant: any;
  thirdParty: any;
  amount: number;
  created: number;
  brandColor: any;
}) {
  return (
    <div className={styles.fullscreenHeader}>
      <div
        className={styles.brandStripe}
        style={{
          backgroundColor: brandColor,
        }}
      ></div>
      <div className={styles.logo}>
        {merchant.logo && (
          <img
            src={
              thirdParty && thirdParty.make_primary
                ? thirdParty.logo
                : merchant.logo
            }
            width={96}
            height={96}
            alt={
              thirdParty && thirdParty.make_primary
                ? thirdParty.name
                : merchant.name
            }
          />
        )}
      </div>
      <h1>Receipt</h1>
      <div className={styles.headerText}>
        <div>
          <div>Invoice number</div>
          <div>Date: {formatDateTime(created)}</div>
        </div>
        <div>
          <div>
            {thirdParty && thirdParty.make_primary ? (
              <>{thirdParty.name}</>
            ) : (
              <>{merchant.name} </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
