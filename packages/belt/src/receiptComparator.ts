import { Receipt } from "versa_unstable_sdk";

export enum ActivityType {
  Shipped = "Shipped",
}

export interface Activity {
  type: ActivityType;
  description?: string;
  activity_at?: number;
}

export interface ReceiptDiff {
  events: Activity[];
}

export interface ReceiptWithProtocolTimestamp {
  receipt: Receipt;
  protocolTimestamp: number;
}

export function compare(
  latest: ReceiptWithProtocolTimestamp,
  previous: ReceiptWithProtocolTimestamp | null
): ReceiptDiff {
  const latestReceipt = latest.receipt;
  const previousReceipt = previous?.receipt;
  const diff: ReceiptDiff = {
    events: [],
  };
  if (!previousReceipt) {
    return diff;
  }
  if (
    previousReceipt.itemization.ecommerce?.shipments &&
    latestReceipt.itemization.ecommerce?.shipments
  ) {
    if (
      latestReceipt.itemization.ecommerce.shipments.length >
      previousReceipt.itemization.ecommerce.shipments.length
    ) {
      diff.events.push({
        type: ActivityType.Shipped,
        activity_at: latest.protocolTimestamp,
        description: "New shipment created",
      });
    }
  }
  return diff;
}

// expect receipts ordered in descending order (most recent first)
export function compareSeries(
  receipts: ReceiptWithProtocolTimestamp[]
): ReceiptDiff {
  const diff: ReceiptDiff = {
    events: [],
  };
  for (let i = receipts.length - 1; i > 0; i--) {
    diff.events = compare(receipts[i - 1], receipts[i]).events.concat(
      diff.events
    );
  }
  return diff;
}
