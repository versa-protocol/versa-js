import styles from "./supplemental-text.module.css";

export function SupplementalText({ text }: { text: string }) {
  return <div className={styles.supplementalText}>{text}</div>;
}
