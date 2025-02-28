import { Org } from "@versaprotocol/schema";
import { UpdateBlock, BlockWrap } from "../receipt-blocks";
import { formatDateTime } from "@versaprotocol/belt";
import styles from "./receipt-with-history.module.css";
import { processHistory } from "../helpers/updates";
import { RegisteredReceipt } from "./model";

import React from "react";
import { ReceiptDisplay } from "../receipt";

export function ReceiptWithHistory({
  merchant,
  receipts,
  theme,
}: {
  merchant: Org;
  receipts: RegisteredReceipt[];
  theme?: string;
}) {
  // First, sort receipts by `registered_at` in reverse-chronological order
  const history = receipts.sort(
    (a, b) => b.registration.registered_at - a.registration.registered_at
  );

  // Set the default receipt to the most recent
  const [currentTransactionEventIndex, setCurrentTransactionEventIndex] =
    React.useState(history[0].registration.transaction_event_index);
  const [data, setData] = React.useState(history[0].receipt);

  // Configure refs for focus management when user wishes to review past versions
  const updatesIndicatorRef = React.useRef<HTMLButtonElement>(null);
  const viewRef = React.useRef<HTMLButtonElement>(null);

  const totalVersions = history.length;
  const totalUpdates = totalVersions - 1;
  const isLatest = currentTransactionEventIndex === totalUpdates;
  const getPreviousVersionHeader = () => {
    if (!history) {
      return "";
    }
    for (const event of history) {
      if (
        event.registration.transaction_event_index ===
        currentTransactionEventIndex
      ) {
        return `Viewing version ${
          currentTransactionEventIndex + 1
        } of ${totalVersions} (${formatDateTime(
          event.registration.registered_at
        )})`;
      }
    }
  };

  const setReceiptView = (index: number) => {
    for (const event of history) {
      if (event.registration.transaction_event_index === index) {
        setData(event.receipt);
        setCurrentTransactionEventIndex(index);
        break;
      }
    }
    if (updatesIndicatorRef.current) {
      updatesIndicatorRef.current.focus();
    }
  };

  const handleUpdateFocus = () => {
    if (viewRef.current) {
      viewRef.current.focus();
    }
  };

  const updates = React.useMemo(() => {
    if (history && history.length) {
      return processHistory(history);
    }
    return [];
  }, [history]);

  return (
    <div className={styles.receiptHistoryWrap}>
      {history && !!history.length && isLatest && (
        <button
          ref={updatesIndicatorRef}
          onClick={handleUpdateFocus}
          className={styles.updateBadge}
        >
          {`${totalUpdates} update${totalUpdates > 1 ? "s" : ""}`}
        </button>
      )}
      {!isLatest && (
        <div className={styles.previousVersionHeader}>
          <div>{getPreviousVersionHeader()}</div>
          <div>
            <button
              onClick={() => {
                setReceiptView(history.length - 1);
              }}
              className={styles.buttonReset}
            >
              Return to latest version
            </button>
          </div>
        </div>
      )}
      <ReceiptDisplay receipt={data} merchant={merchant} theme={theme} />
      {!!updates?.length && (
        <BlockWrap>
          <UpdateBlock
            originalRegistrationTimestamp={
              history[history.length - 1].registration.registered_at
            }
            currentTransactionEventIndex={currentTransactionEventIndex}
            updates={updates}
            viewRef={viewRef}
            onViewPreviousVersion={setReceiptView}
          />
        </BlockWrap>
      )}
    </div>
  );
}
