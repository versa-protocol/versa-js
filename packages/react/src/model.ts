import { Receipt } from "@versaprotocol/schema";

export interface Registration {
  receipt_id: string;
  transaction_id: string;
  registered_at: number;
  transaction_event_index: number;
  handles: TransactionHandles;
}

export interface RegisteredReceipt<T = Receipt> {
  receipt: T;
  registration: Registration;
}

export interface TransactionHandles {
  customer_email_domain?: string | null;
  customer_email?: string | null;
}

export interface Sender {
  name: string;
  brand_color?: string | null;
  legal_name?: string | null;
  logo?: string | null;
  website?: string | null;
  vat_number?: string | null;
  org_id: string;
}
