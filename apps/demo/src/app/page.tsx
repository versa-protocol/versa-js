import styles from "./page.module.css";
import { Studio } from "@/components/studio/interactiveStudio";

export default function Home() {
  return (
    <main className={styles.main}>
      <Studio />
    </main>
  );
}
