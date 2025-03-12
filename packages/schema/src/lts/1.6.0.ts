/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type SchemaVersion = string;
/**
 * ISO 4217 currency code
 */
export type Currency = "usd" | "eur" | "jpy" | "gbp" | "aud" | "cad" | "chf" | "cnh";
export type AdjustmentType = "discount" | "tip" | "fee" | "other";
export type SubscriptionType = "one_time" | "recurring";
export type Interval = "day" | "week" | "month" | "year";

/**
 * A Versa itemized receipt
 */
export interface Receipt {
  schema_version: SchemaVersion;
  header: Header;
  itemization: Itemization;
  actions: Action[];
  payments: Payment[];
}
export interface Header {
  invoice_number?: string | null;
  currency: Currency;
  total: number;
  subtotal: number;
  paid: number;
  invoiced_at: number;
  mcc?: string | null;
  third_party?: {
    first_party_relation:
      | "bnpl"
      | "delivery_service"
      | "marketplace"
      | "payment_processor"
      | "platform"
      | "point_of_sale";
    /**
     * Determines whether the merchant or third party gets top billing on the receipt
     */
    make_primary: boolean;
    merchant: Org;
  } | null;
  customer?: Customer | null;
  location?: Place | null;
  invoice_asset_id?: string | null;
  receipt_asset_id?: string | null;
}
export interface Org {
  name: string;
  brand_color?: string | null;
  legal_name?: string | null;
  logo?: string | null;
  website?: string | null;
  vat_number?: string | null;
  address?: null | Address;
}
export interface Address {
  street_address?: string | null;
  city?: string | null;
  region?: null | string;
  country?: null | string;
  postal_code?: string | null;
  lat?: number | null;
  lon?: number | null;
  tz?: string | null;
}
export interface Customer {
  name: string;
  email: string | null;
  address: null | Address;
  phone: string | null;
  metadata: Metadatum[];
}
export interface Metadatum {
  key: string;
  value: string;
}
/**
 * The physical or online location where a transaction occurred
 */
export interface Place {
  name: string | null;
  address: null | Address;
  phone: string | null;
  url: null | string;
  google_place_id: string | null;
  image: null | string;
}
export interface Itemization {
  general?: GeneralItemization | null;
  lodging?: Lodging | null;
  ecommerce?: Ecommerce | null;
  car_rental?: CarRental | null;
  transit_route?: TransitRoute | null;
  subscription?: Subscription | null;
  flight?: Flight | null;
}
export interface GeneralItemization {
  /**
   * @minItems 1
   */
  items: Item[];
  invoice_level_adjustments: Adjustment[];
}
export interface Item {
  date?: null | string;
  description: string;
  amount: number;
  quantity?: null | number;
  unit_cost?: null | number;
  unit?: null | string;
  unspsc?: null | string;
  taxes?: Tax[];
  metadata?: Metadatum[];
  product_image_asset_id?: null | string;
  group?: null | string;
  url?: null | string;
  adjustments?: Adjustment[];
}
export interface Tax {
  amount: number;
  rate: number | null;
  name: string;
}
export interface Adjustment {
  amount: number;
  name: null | string;
  adjustment_type: AdjustmentType;
  rate: null | number;
}
export interface Lodging {
  check_in: number;
  check_out: number;
  location: Place;
  /**
   * @minItems 1
   */
  items: Item[];
  room?: null | string;
  guests?: null | string;
  metadata?: Metadatum[];
  invoice_level_adjustments: Adjustment[];
}
export interface Ecommerce {
  shipments: Shipment[];
  invoice_level_line_items: Item[];
  invoice_level_adjustments: Adjustment[];
}
export interface Shipment {
  /**
   * @minItems 1
   */
  items: Item[];
  tracking_number?: string | null;
  expected_delivery_at?: number | null;
  shipment_status?: ("prep" | "in_transit" | "delivered") | null;
  destination_address?: null | Address;
}
export interface CarRental {
  rental_at: number;
  return_at: number;
  rental_location: Place;
  return_location: Place;
  vehicle?: {
    description: string;
    image: string | null;
  } | null;
  driver_name: string;
  odometer_reading_in: number;
  odometer_reading_out: number;
  /**
   * @minItems 1
   */
  items: Item[];
  invoice_level_adjustments: Adjustment[];
  metadata: Metadatum[];
}
export interface TransitRoute {
  /**
   * @minItems 1
   */
  transit_route_items: TransitRouteItem[];
  invoice_level_adjustments: Adjustment[];
}
export interface TransitRouteItem {
  departure_location?: null | Place;
  arrival_location?: null | Place;
  departure_at?: number | null;
  arrival_at?: number | null;
  polyline?: null | string;
  adjustments: Adjustment[];
  taxes: Tax[];
  metadata: Metadatum[];
  fare: number;
  passenger?: string | null;
  mode?: ("car" | "taxi" | "rail" | "bus" | "ferry" | "other") | null;
}
export interface Subscription {
  /**
   * @minItems 1
   */
  subscription_items: SubscriptionItem[];
  invoice_level_adjustments: Adjustment[];
}
export interface SubscriptionItem {
  amount: number;
  subscription_type: SubscriptionType;
  description: string;
  interval?: null | Interval;
  interval_count?: number | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  quantity?: number | null;
  unit_cost?: number | null;
  taxes: Tax[];
  metadata: Metadatum[];
  adjustments: Adjustment[];
}
export interface Flight {
  /**
   * @minItems 1
   */
  tickets: FlightTicket[];
  itinerary_locator?: null | string;
  invoice_level_adjustments: Adjustment[];
}
export interface FlightTicket {
  /**
   * @minItems 1
   */
  segments: FlightSegment[];
  number?: null | string;
  record_locator?: null | string;
  passenger?: null | string;
  metadata: Metadatum[];
}
export interface FlightSegment {
  fare: number;
  departure_airport_code: string;
  arrival_airport_code: string;
  departure_at?: null | number;
  arrival_at?: null | number;
  departure_tz?: null | string;
  arrival_tz?: null | string;
  flight_number?: null | string;
  seat?: null | string;
  class_of_service?: null | string;
  taxes: Tax[];
  metadata: Metadatum[];
  adjustments: Adjustment[];
}
export interface Action {
  name: string;
  url: string;
}
export interface Payment {
  amount: number;
  paid_at: number;
  payment_type: "card" | "ach";
  card_payment?: null | CardPayment;
  ach_payment?: null | AchPayment;
}
export interface CardPayment {
  last_four: string;
  network: ("amex" | "diners" | "discover" | "eftpos_au" | "jcb" | "mastercard" | "unionpay" | "visa") | null;
}
export interface AchPayment {
  routing_number: string;
}
