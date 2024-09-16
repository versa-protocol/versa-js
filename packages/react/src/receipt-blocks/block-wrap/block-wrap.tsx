import React, { ReactNode } from "react";
import styles from "./block-wrap.module.css";

interface BlockWrapProps {
  children: ReactNode;
}

export function BlockWrap({ children }: BlockWrapProps) {
  return <div className={styles.blockWrap}>{children}</div>;
}
