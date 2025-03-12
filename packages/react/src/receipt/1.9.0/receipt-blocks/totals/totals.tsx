import { formatUSD } from "@versaprotocol/belt";
import styles from "./totals.module.css";
import { ChevronDown } from "react-feather";
import { Adjustment, Tax } from "@versaprotocol/schema";

import { lts } from "@versaprotocol/schema";
type Receipt = lts.v1_9_0.Receipt;

type Colors = {
  brand: string;
  brandHighContrast: string;
  brandThemeLight: boolean;
};

export function Totals({
  taxes,
  header,
  adjustments,
  colors,
}: {
  taxes: Tax[];
  header: Receipt["header"];
  adjustments: Adjustment[] | null;
  colors: Colors;
}) {
  return (
    <div className={styles.totalsWrap}>
      <div></div>
      <div>
        <div className={styles.row}>
          <div className={styles.blockLabel}>Subtotal</div>
          <div className={styles.blockValue}>
            {formatUSD(header.subtotal / 100)}
          </div>
        </div>
        {adjustments &&
          adjustments.map((a: any, index: any) => (
            <div className={styles.row} key={index}>
              <div className={styles.blockLabel}>
                <div>
                  <span>{a.name ? a.name : a.adjustment_type}</span>{" "}
                  {a.rate && (
                    <span className={styles.tax}>({a.rate * 100}%)</span>
                  )}
                </div>
              </div>
              <div className={styles.blockValue}>
                {formatUSD(a.amount / 100)}
              </div>
            </div>
          ))}
        {taxes && (
          <>
            {taxes.map((tft: Tax, index: number) => (
              <div key={index} className={styles.row}>
                <div className={styles.blockLabel}>
                  <div>
                    <span>{tft.name}</span>{" "}
                    {tft.rate && (
                      <span className={styles.tax}>({tft.rate * 100}%)</span>
                    )}
                  </div>
                </div>
                <div className={styles.blockValue}>
                  {formatUSD(tft.amount / 100)}
                </div>
              </div>
            ))}
            {taxes.length > 5 && (
              <div className={styles.row}>
                <div
                  className={styles.blockLabel}
                  style={{
                    color: colors.brandHighContrast,
                  }}
                >
                  View All
                  <ChevronDown
                    style={{
                      stroke: colors.brandHighContrast,
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div className={`${styles.row} ${styles.bottomLine}`}>
          <div className={styles.blockLabel}>Total</div>
          <div className={styles.blockValue}>
            {formatUSD(header.total / 100)}
          </div>
        </div>
      </div>
    </div>
  );
}
