import { formatDateTime } from "@versaprotocol/belt";
import styles from "./update-block.module.css";
import { GroupedUpdate } from "../../helpers/updates";
import React from "react";
import { ArrowLeftCircle, ArrowRightCircle, Circle } from "react-feather";

export function UpdateBlock({
  updates,
  viewRef,
}: {
  updates: GroupedUpdate[];
  viewRef: React.RefObject<HTMLButtonElement>;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const showLeftArrow = currentIndex < updates.length - 1;
  const showRightArrow = currentIndex > 0;

  return (
    <div className={styles.activityBlockWrap}>
      <div className={styles.updateCard}>
        {updates.map((currentUpdate, index) => (
          <div key={index} className={styles.versionWrap}>
            <div key={index} className={styles.updateContent}>
              <Circle />
              <div>
                {currentUpdate.updates.map((u, uindex) => (
                  <div key={uindex} className={styles.activityItem}>
                    <div>{u.description}</div>
                    {!!u.timestamp && (
                      <div className={styles.timestamp}>
                        {formatDateTime(u.timestamp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              ref={index === 0 ? viewRef : null}
              className={styles.viewButton}
            >
              View this version
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
