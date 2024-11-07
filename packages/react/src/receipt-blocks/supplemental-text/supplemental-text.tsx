import styles from "./supplemental-text.module.css";
import Markdown from "react-markdown";

export function SupplementalText({ text }: { text: string }) {
  return <Markdown className={styles.supplementalText}>{text}</Markdown>;
}
