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
    <div className={styles.wrap}>
      {errors.map((e) => (
        <div>{e.keyword}</div>
      ))}
    </div>
  );
}
