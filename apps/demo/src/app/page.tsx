import styles from "./page.module.css";
import { Studio } from "@/components/studio/interactiveStudio";
import Image from "next/image";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        src="https://versa.org/versa-logo.svg"
        width={96}
        height={25}
        alt=""
        className={styles.logo}
      />
      <Studio />
    </main>
  );
}
