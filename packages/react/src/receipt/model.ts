import { Receipt } from "@versaprotocol/schema";

export interface Registration {
  receipt_id: string;
  transaction_id: string;
  registered_at: number;
  transaction_event_index: number;
}

export interface RegisteredReceipt<T = Receipt> {
  receipt: T;
  registration: Registration;
}
