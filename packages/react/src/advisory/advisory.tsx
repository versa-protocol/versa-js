import { AlertTriangle, XOctagon } from "react-feather";
import styles from "./advisory.module.css";

export interface MisuseReport {
  misuseCode: string;
  misuseText?: string | null;
}

export function Advisory({
  errors,
  warnings,
}: {
  errors: string[];
  warnings: string[];
}) {
  return (
    <div className={styles.advisory}>
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((e, i) => (
            <li key={i}>
              <XOctagon size={16} />
              <div>{e}</div>
            </li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className={styles.warnings}>
          {warnings.map((w, i) => (
            <li key={i}>
              <AlertTriangle size={16} />
              <div>{w}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
