import { Org, Receipt } from "@versaprotocol/schema";

// DEMO
import bend from "./senders/bend.json";
import jetblue from "./senders/jetblue.json";
import rocketco from "./senders/rocketco.json";
import sonesta from "./senders/sonesta.json";
import generic from "./senders/generic.json";

import untypedFlight from "./receipts/flight.json";
import untypedFlightMultiple from "./receipts/flight_multiple.json";
import untypedRideshare from "./receipts/rideshare_polyline.json";
import untypedSimple from "./receipts/simple.json";
import untypedSubscription from "./receipts/subscription.json";
import untypedRail from "./receipts/rail.json";
import untypedLodging from "./receipts/lodging_alt.json";
import untypedCarRental from "./receipts/car_rental.json";
import untypedAsana from "./receipts/asana.json";
import untypedEcommerce from "./receipts/ecommerce.json";
import untypedFastFood from "./receipts/fast_food.json";
import untypedFoodDelivery from "./receipts/food_delivery.json";
const flight = untypedFlight as Receipt;
const flightMultiple = untypedFlightMultiple as Receipt;
const rail = untypedRail as unknown as Receipt; // TODO(why?)
const rideshare = untypedRideshare as unknown as Receipt; // TODO(why?)
const simple = untypedSimple as Receipt;
const subscription = untypedSubscription as Receipt;
const lodging = untypedLodging as Receipt;
const carRental = untypedCarRental as Receipt;
const asana = untypedAsana as Receipt;
const ecommerce = untypedEcommerce as Receipt;
const fastFood = untypedFastFood as Receipt;
const foodDelivery = untypedFoodDelivery as Receipt;

export const senders: Record<string, Org> = {
  bend,
  jetblue,
  rocketco,
  sonesta,
  generic,
};
export const receipts: Record<string, Receipt> = {
  flight,
  flightMultiple,
  lodging,
  rideshare,
  simple,
  subscription,
  rail,
  carRental,
  asana,
  ecommerce,
  fastFood,
  foodDelivery,
};
