import { Org } from "@versaprotocol/schema";
import { UpdateBlock, BlockWrap } from "../receipt-blocks";
import { formatDateTime } from "@versaprotocol/belt";
import styles from "./receipt-with-history.module.css";
import { processHistory } from "../helpers/updates";
import { RegisteredReceipt } from "./model";

import React from "react";
import { ReceiptDisplay } from "../receipt";

export function ReceiptWithHistory({
  receipt,
  merchant,
  history,
  theme,
}: {
  receipt: RegisteredReceipt;
  merchant: Org;
  history?: RegisteredReceipt[];
  theme?: string;
}) {
  const [currentTransactionEventIndex, setCurrentTransactionEventIndex] =
    React.useState(receipt.registration.transaction_event_index);
  const [data, setData] = React.useState(receipt.receipt);
  const updatesIndicatorRef = React.useRef<HTMLButtonElement>(null);
  const viewRef = React.useRef<HTMLButtonElement>(null);

  const getUpdateIndicatorText = () => {
    if (!history) {
      return "";
    }
    const historyLength = history.length;
    if (currentTransactionEventIndex === history.length) {
      return `${historyLength} Update${historyLength > 1 ? "s" : ""}`;
    } else {
      for (const event of history) {
        if (
          event.registration.transaction_event_index ===
          currentTransactionEventIndex
        ) {
          return `Viewing ${formatDateTime(
            event.registration.registered_at
          )} Version`;
        }
      }
    }
  };

  const setReceiptView = (index: number) => {
    if (index === receipt.registration.transaction_event_index) {
      setData(receipt.receipt);
      setCurrentTransactionEventIndex(index);
      if (updatesIndicatorRef.current) {
        updatesIndicatorRef.current.focus();
      }
      return;
    }
    if (!history) {
      return;
    }
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
      return processHistory(receipt, history);
    }
    return [];
  }, [receipt, history]);

  return (
    <div className={styles.receiptHistoryWrap}>
      {history && !!history.length && (
        <button
          ref={updatesIndicatorRef}
          onClick={handleUpdateFocus}
          className={styles.updateBadge}
        >
          {getUpdateIndicatorText()}
        </button>
      )}
      <ReceiptDisplay receipt={data} merchant={merchant} theme={theme} />
      {!!updates?.length && (
        <BlockWrap>
          <UpdateBlock
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
