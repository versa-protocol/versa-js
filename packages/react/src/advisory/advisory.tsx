import { AlertTriangle, XOctagon } from "react-feather";
import styles from "./advisory.module.css";

interface SchemaValidationErrorUnit {
  keyword: string;
  keywordLocation: string;
  instanceLocation: string;
  error: string;
}

export interface Violation {
  rule: string;
  description: string;
  details?: string | null;
}

export interface MisuseReport {
  misuseCode: string;
  misuseText?: string | null;
}

export function Advisory({
  breakingError,
  errors,
  misuse,
  warnings,
}: {
  breakingError?: string | null;
  errors: SchemaValidationErrorUnit[];
  misuse?: MisuseReport;
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
  if (misuse) {
    return (
      <div className={styles.advisory}>
        <ul className={styles.warnings}>
          <li>
            <AlertTriangle size={16} />
            <div>
              Misuse Reported: {misuse.misuseCode}
              <div>{misuse.misuseText ? `${misuse.misuseText}` : null}</div>
            </div>
          </li>
        </ul>
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
              <div>
                {w.description}
                {w.details ? ` (${w.details})` : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
