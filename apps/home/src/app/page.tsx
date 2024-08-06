import Image from "next/image";
import styles from "./page.module.css";
import { DemoReceipt } from "@/components/receipt";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        src="https://versa.org/versa-logo.svg"
        width={96}
        height={25}
        alt=""
      />
      <div className={styles.demo}>
        <div className={styles.intro}>
          <h1>Home</h1>
          <p>Welcome to the Versa JS landing page.</p>
        </div>
        <div className={styles.receiptWrap}>
          <DemoReceipt />
        </div>
      </div>
    </main>
  );
}
