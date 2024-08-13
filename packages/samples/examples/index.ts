import { Merchant, Receipt } from "@versaprotocol/schema";

// DEMO
import rocketco from "./senders/rocketco.json";
import bend from "./senders/bend.json";

import untypedFlight from "./receipts/flight.json";
import untypedFlightMultiple from "./receipts/flight_multiple.json";
import untypedRideshare from "./receipts/rideshare_polyline.json";
import untypedSimple from "./receipts/simple.json";
import untypedSubscription from "./receipts/subscription.json";
import untypedRail from "./receipts/rail.json";

const flight = untypedFlight as Receipt;
const flightMultiple = untypedFlightMultiple as Receipt;
const rail = untypedRail as unknown as Receipt; // TODO(why?)
const rideshare = untypedRideshare as unknown as Receipt; // TODO(why?)
const simple = untypedSimple as Receipt;
const subscription = untypedSubscription as Receipt;

export const senders: Record<string, Merchant> = {
  rocketco,
  bend,
};
export const receipts: Record<string, Receipt> = {
  flight,
  flightMultiple,
  rideshare,
  simple,
  subscription,
  rail,
};
