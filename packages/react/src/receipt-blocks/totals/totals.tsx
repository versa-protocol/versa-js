import { formatTransactionValue } from "@versa/belt";
import styles from "./totals.module.css";
import { ChevronDown } from "react-feather";
import { Adjustment, Receipt, Tax } from "@versa/schema";

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
  taxes: Tax[] | null;
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
            {formatTransactionValue(header.subtotal, header.currency)}
          </div>
        </div>
        {taxes && (
          <>
            {taxes?.map((tft: Tax, index: number) => (
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
                  {formatTransactionValue(tft.amount, header.currency)}
                </div>
              </div>
            ))}
            {taxes && taxes.length > 5 && (
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
        {adjustments &&
          adjustments.map((a: any, index: any) => (
            <div className={styles.row} key={index}>
              <div className={styles.blockLabel}>
                <div>
                  <span>
                    {a.name ? a.name : a.adjustment_type.replaceAll("_", " ")}
                  </span>{" "}
                  {a.rate && (
                    <span className={styles.tax}>({a.rate * 100}%)</span>
                  )}
                </div>
              </div>
              <div className={styles.blockValue}>
                {formatTransactionValue(a.amount, header.currency)}
              </div>
            </div>
          ))}
        <div className={`${styles.row} ${styles.bottomLine}`}>
          <div className={styles.blockLabel}>Total</div>
          <div className={styles.blockValue}>
            {formatTransactionValue(header.total, header.currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
