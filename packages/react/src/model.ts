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
  org_id: string;
  brand_color?: string;
  legal_name?: string;
  logo?: string;
  name: string;
  vat_number?: string;
  website: string;
}

export interface RegistryData {
  receipt_id: string;
  receipt_hash: string;
  schema_version: string;
  transaction_id: string;
  sender: Sender;
  handles: TransactionHandles;
  registered_at: number;
  transaction_event_index: number;
}
