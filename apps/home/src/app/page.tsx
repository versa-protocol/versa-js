import styles from "./page.module.css";
import InteractiveStudio from "@/components/studio/interactiveStudio";

export default function Home() {
  return (
    <main className={styles.main}>
      <InteractiveStudio />
    </main>
  );
}
