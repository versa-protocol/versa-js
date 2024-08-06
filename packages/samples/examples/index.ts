import { Merchant, Receipt } from "versa_unstable_sdk";

// DEMO
import rocketco from "./senders/rocketco.json";
import bend from "./senders/bend.json";

import untypedSimple from "./receipts/simple.json";
import untypedSubscription from "./receipts/subscription.json";

const simple = untypedSimple as Receipt;
const subscription = untypedSubscription as Receipt;

export const senders: Record<string, Merchant> = {
  rocketco,
  bend,
};
export const receipts: Record<string, Receipt> = {
  simple,
  subscription,
};
