import { formatDateTimeWithPlaces } from "@versa/belt";
import styles from "./update-block.module.css";
import { GroupedUpdate } from "../../helpers/updates";
import React from "react";

export function UpdateBlock({
  originalRegistrationTimestamp,
  currentTransactionEventIndex,
  updates,
  viewRef,
  onViewPreviousVersion,
}: {
  originalRegistrationTimestamp: number;
  currentTransactionEventIndex: number;
  updates: GroupedUpdate[];
  viewRef: React.RefObject<HTMLButtonElement>;
  onViewPreviousVersion: (_transactionEventIndex: number) => void;
}) {
  // Determine the latest transactionEventIndex
  const latestTransactionEventIndex =
    updates.length > 0 ? updates[updates.length - 1].transactionEventIndex : 0;

  return (
    <div className={styles.activityBlockWrap}>
      <div>
        <div className={styles.versionWrap}>
          <div className={styles.updateContent}>
            <div className={styles.updateDescription}>Initial receipt.</div>
            <div className={styles.timestamp}>
              {formatDateTimeWithPlaces(originalRegistrationTimestamp, [])}
            </div>
          </div>
          {/* Initial receipt logic */}
          {currentTransactionEventIndex === 0 &&
          currentTransactionEventIndex !== latestTransactionEventIndex ? (
            <div className={styles.subwayStop}>
              <div className={styles.currentlyViewing}>
                You are viewing this version
              </div>
            </div>
          ) : currentTransactionEventIndex !== 0 ? (
            <div className={styles.subwayStop}>
              <button
                ref={viewRef}
                className={styles.viewButton}
                onClick={() => onViewPreviousVersion(0)}
              >
                View
              </button>
            </div>
          ) : null}
        </div>
        {updates.map((currentUpdate, index) => {
          const isLastUpdate = index === updates.length - 1;
          const isCurrent =
            currentTransactionEventIndex ===
            currentUpdate.transactionEventIndex;
          return (
            <div key={index} className={styles.versionWrap}>
              <div className={styles.updateContent}>
                <div>
                  {currentUpdate.updates.map((u, uindex) => (
                    <div key={uindex} className={styles.activityItem}>
                      <div className={styles.updateDescription}>
                        {u.description}.
                      </div>
                    </div>
                  ))}
                  <div className={styles.timestamp}>
                    {formatDateTimeWithPlaces(currentUpdate.registeredAt, [])}
                  </div>
                </div>
              </div>
              {/* Only show 'You are viewing this version' if it's current and not the last update */}
              {isCurrent && !isLastUpdate ? (
                <div className={styles.subwayStop}>
                  <div className={styles.currentlyViewing}>
                    You are viewing this version
                  </div>
                </div>
              ) : !isCurrent ? (
                <div className={styles.subwayStop}>
                  <button
                    ref={viewRef}
                    className={styles.viewButton}
                    onClick={() =>
                      onViewPreviousVersion(currentUpdate.transactionEventIndex)
                    }
                  >
                    View
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
