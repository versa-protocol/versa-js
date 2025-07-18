import { RegisteredReceipt } from "../model";

export interface Update {
  description: string;
}

export interface GroupedUpdate {
  description: string;
  transactionEventIndex: number;
  updates: Update[];
  registeredAt: number;
}

// Expects the history to be sorted in reverse-chronological order
export function processHistory(history: RegisteredReceipt[]): GroupedUpdate[] {
  const updates: GroupedUpdate[] = [];
  const mutableHistory = [...history];
  let current = mutableHistory.shift();
  if (!current) {
    return [];
  }
  while (mutableHistory.length > 0) {
    const oldReceipt = mutableHistory.shift();
    if (!oldReceipt) {
      break;
    }
    const diff = diffReceipts(oldReceipt, current);
    if (diff.length > 0) {
      updates.unshift({
        description: `Receipt`,
        updates: diff,
        transactionEventIndex: current.registration.transaction_event_index,
        registeredAt: current.registration.registered_at,
      });
    }
    current = oldReceipt;
  }
  return updates;
}

export function diffReceipts(
  oldReceipt: RegisteredReceipt,
  newReceipt: RegisteredReceipt
): Update[] {
  const updates: Update[] = [];
  // based on schema, check if a payment was added

  if (newReceipt.receipt.payments.length > oldReceipt.receipt.payments.length) {
    const newPayment = newReceipt.receipt.payments.find(
      (payment) => !oldReceipt.receipt.payments.includes(payment)
    );
    if (newPayment) {
      updates.push({
        description: `Payment added for ${(newPayment.amount / 100).toFixed(
          2
        )} ${newReceipt.receipt.header.currency.toUpperCase()}`,
      });
    }
  }

  if (newReceipt.receipt.itemization.ecommerce) {
    let oldItemsShipped = 0;
    let newItemsShipped = 0;

    for (const shipment of oldReceipt.receipt.itemization.ecommerce
      ?.shipments || []) {
      oldItemsShipped += shipment.items.length;
    }
    for (const shipment of newReceipt.receipt.itemization.ecommerce.shipments) {
      newItemsShipped += shipment.items.length;
    }
    if (newItemsShipped > oldItemsShipped) {
      const diff = newItemsShipped - oldItemsShipped;
      updates.push({
        description: `${diff} item${diff === 1 ? "" : "s"} shipped`,
      });
    }
  }

  if (updates.length === 0) {
    updates.push({
      description: "Receipt updated",
    });
  }

  return updates;
}
