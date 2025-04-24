import { AlertTriangle, XOctagon } from "react-feather";
import styles from "./advisory.module.css";
interface OutputUnit {
  keyword: string;
  keywordLocation: string;
  instanceLocation: string;
  error: string;
}

interface Violation {
  description: string;
  rule: string;
  details: string;
}

export function Advisory({
  breakingError,
  errors,
  warnings,
}: {
  breakingError?: string | null;
  errors: OutputUnit[];
  warnings: Violation[];
}) {
  if (breakingError) {
    return (
      <div className={styles.advisory}>
        <div className={styles.breakingError}>
          <ul className={styles.errors}>
            <li>
              <XOctagon size={16} />
              <div>{breakingError}</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.advisory}>
      {errors.length > 0 && (
        <ul className={styles.errors}>
          <li>
            <XOctagon size={16} />
            <div>
              {errors.reduce((msg, e) => {
                if (msg.length > 0) {
                  msg += " ";
                }
                return (msg += e.error);
              }, "")}
            </div>
          </li>
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className={styles.warnings}>
          {warnings.map((w) => (
            <li key={w.rule}>
              <AlertTriangle size={16} />
              <div>{w.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
