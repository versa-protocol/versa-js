import { formatDateTimeWithPlaces } from "@versa/belt";
import styles from "../../../../receipt-blocks/update-block/update-block.module.css";
import { GroupedUpdate } from "../../../../helpers/updates";
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
          {currentTransactionEventIndex === 0 ? (
            <div className={styles.subwayStop}>
              <div className={styles.currentlyViewing}>
                You are viewing this version
              </div>
            </div>
          ) : (
            <div className={styles.subwayStop}>
              <button
                ref={viewRef}
                className={styles.viewButton}
                onClick={() => onViewPreviousVersion(0)}
              >
                View
              </button>
            </div>
          )}
        </div>
        {updates.map((currentUpdate, index) => (
          <div key={index} className={styles.versionWrap}>
            <div key={index} className={styles.updateContent}>
              <div>
                {currentUpdate.updates.map((u: any, uindex: any) => (
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
            {currentTransactionEventIndex ===
            currentUpdate.transactionEventIndex ? (
              <div className={styles.subwayStop}>
                <div className={styles.currentlyViewing}>
                  You are viewing this version
                </div>
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
