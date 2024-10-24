import Image from "next/image";
import styles from "./page.module.css";
import { DemoReceipt } from "@/components/staticDemoReceipt";

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
      <div className={styles.demo}>
        <div className={styles.receiptWrap}>
          <DemoReceipt />
        </div>
      </div>
    </main>
  );
}
