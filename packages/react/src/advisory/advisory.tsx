import { AlertTriangle, XOctagon } from "react-feather";
import styles from "./advisory.module.css";
interface OutputUnit {
  keyword: string;
  keywordLocation: string;
  instanceLocation: string;
  error: string;
}
export function Advisory({
  errors,
  warnings,
}: {
  errors: OutputUnit[];
  warnings: string[];
}) {
  return (
    <div>
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((e) => (
            <li>
              <XOctagon size={16} />
              <div>{e.keyword}</div>
            </li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className={styles.warnings}>
          {warnings.map((w) => (
            <li>
              <AlertTriangle size={16} />
              <div>{w}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
