import { Receipt } from "@versaprotocol/schema";

export interface Update {
  description: string;
  timestamp?: number;
}

export interface GroupedUpdate {
  description: string;
  updates: Update[];
}

export function processHistory(
  receipt: Receipt,
  history: Receipt[]
): GroupedUpdate[] {
  let current = receipt;
  const updates: GroupedUpdate[] = [];
  const mutableHistory = [...history];
  while (mutableHistory.length > 0) {
    const oldReceipt = mutableHistory.shift();
    if (!oldReceipt) {
      break;
    }
    const diff = diffReceipts(oldReceipt, current);
    if (diff.length > 0) {
      updates.push({
        description: `Receipt`,
        updates: diff,
      });
    }
    current = oldReceipt;
  }
  return updates;
}

export function diffReceipts(
  oldReceipt: Receipt,
  newReceipt: Receipt
): Update[] {
  const updates: Update[] = [];
  // based on schema, check if a payment was added

  if (newReceipt.payments.length > oldReceipt.payments.length) {
    const newPayment = newReceipt.payments.find(
      (payment) => !oldReceipt.payments.includes(payment)
    );
    if (newPayment) {
      updates.push({
        description: `Payment added for ${(newPayment.amount / 100).toFixed(
          2
        )} ${newReceipt.header.currency.toUpperCase()}`,
        timestamp: newPayment.paid_at,
      });
    }
  }

  if (newReceipt.itemization.ecommerce) {
    if (
      newReceipt.itemization.ecommerce.shipments.length >
      (oldReceipt.itemization.ecommerce?.shipments?.length || 0)
    ) {
      const newShipment = newReceipt.itemization.ecommerce.shipments.find(
        (shipment) =>
          !oldReceipt.itemization.ecommerce?.shipments.includes(shipment)
      );
      if (newShipment) {
        updates.push({
          description: `Shipment added for ${newShipment.items.length} items`,
        });
      }
    }
  }

  return updates;
}
