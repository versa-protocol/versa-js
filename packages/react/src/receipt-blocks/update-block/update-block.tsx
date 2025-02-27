import { formatDateTime } from "@versaprotocol/belt";
import styles from "./update-block.module.css";
import { GroupedUpdate } from "../../helpers/updates";
import React from "react";
import { Circle } from "react-feather";

export function UpdateBlock({
  currentTransactionEventIndex,
  updates,
  viewRef,
  onViewPreviousVersion,
}: {
  currentTransactionEventIndex: number;
  updates: GroupedUpdate[];
  viewRef: React.RefObject<HTMLButtonElement>;
  onViewPreviousVersion: (transactionEventIndex: number) => void;
}) {
  return (
    <div className={styles.activityBlockWrap}>
      <div className={styles.updateCard}>
        <div className={styles.versionWrap}>
          {currentTransactionEventIndex === 0 ? (
            <div className={styles.subwayStop}>
              <Circle />
              <div className={styles.currentlyViewing}>
                You are viewing the original
              </div>
            </div>
          ) : (
            <div className={styles.subwayStop}>
              <Circle />
              <button
                className={styles.viewButton}
                onClick={() => onViewPreviousVersion(0)}
              >
                View original
              </button>
            </div>
          )}
        </div>
        {updates.map((currentUpdate, index) => (
          <div key={index} className={styles.versionWrap}>
            {currentTransactionEventIndex ===
            currentUpdate.transactionEventIndex ? (
              <div className={styles.subwayStop}>
                <Circle />
                <div className={styles.currentlyViewing}>
                  You are viewing this version
                </div>
              </div>
            ) : (
              <div className={styles.subwayStop}>
                <Circle />
                <button
                  ref={
                    currentTransactionEventIndex !==
                    currentUpdate.transactionEventIndex
                      ? viewRef
                      : null
                  }
                  className={styles.viewButton}
                  onClick={() =>
                    onViewPreviousVersion(currentUpdate.transactionEventIndex)
                  }
                >
                  View this version
                </button>
              </div>
            )}
            <div key={index} className={styles.updateContent}>
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
          </div>
        ))}
      </div>
    </div>
  );
}
