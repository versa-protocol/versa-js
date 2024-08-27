import {
  Itemization,
  Tax,
  Flight,
  Item,
  Ecommerce,
  Place,
  ItemMetadata,
  TransitRoute,
  FlightSegment,
  FlightTicket,
} from "@versaprotocol/schema";
import canonicalize from "canonicalize";

export function aggregateTaxes(itemization: Itemization): Tax[] {
  const aggregatedTaxes: Record<string, Tax> = {};
  if (itemization.transit_route) {
    for (const item of itemization.transit_route.transit_route_items) {
      for (const tax of item.taxes || []) {
        if (aggregatedTaxes[tax.name + tax.rate]) {
          aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
        } else {
          aggregatedTaxes[tax.name + tax.rate] = { ...tax };
        }
      }
    }
  }
  if (itemization.subscription) {
    for (const subscription_item of itemization.subscription
      .subscription_items) {
      for (const tax of subscription_item.taxes || []) {
        if (aggregatedTaxes[tax.name + tax.rate]) {
          aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
        } else {
          aggregatedTaxes[tax.name + tax.rate] = { ...tax };
        }
      }
    }
  }
  if (itemization.flight) {
    for (const ticket of itemization.flight.tickets) {
      for (const segment of ticket.segments) {
        for (const tax of segment.taxes || []) {
          if (aggregatedTaxes[tax.name + tax.rate]) {
            aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
          } else {
            aggregatedTaxes[tax.name + tax.rate] = { ...tax };
          }
        }
      }
    }
  }
  if (itemization.car_rental) {
    for (const item of itemization.car_rental.items) {
      for (const tax of item.taxes || []) {
        if (aggregatedTaxes[tax.name + tax.rate]) {
          aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
        } else {
          aggregatedTaxes[tax.name + tax.rate] = { ...tax };
        }
      }
    }
  }
  if (itemization.lodging) {
    for (const lodging_item of itemization.lodging.lodging_items) {
      for (const item of lodging_item.items) {
        for (const tax of item.taxes || []) {
          if (aggregatedTaxes[tax.name + tax.rate]) {
            aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
          } else {
            aggregatedTaxes[tax.name + tax.rate] = { ...tax };
          }
        }
      }
    }
  }
  if (itemization.ecommerce) {
    if (itemization.ecommerce.invoice_level_line_items) {
      for (const item of itemization.ecommerce.invoice_level_line_items) {
        for (const tax of item.taxes || []) {
          if (aggregatedTaxes[tax.name + tax.rate]) {
            aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
          } else {
            aggregatedTaxes[tax.name + tax.rate] = { ...tax };
          }
        }
      }
    }
    if (itemization.ecommerce.shipments) {
      for (const shipment of itemization.ecommerce.shipments) {
        for (const item of shipment.items) {
          for (const tax of item.taxes || []) {
            if (aggregatedTaxes[tax.name + tax.rate]) {
              aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
            } else {
              aggregatedTaxes[tax.name + tax.rate] = { ...tax };
            }
          }
        }
      }
    }
  }
  if (itemization.general) {
    for (const item of itemization.general.line_items) {
      for (const tax of item.taxes || []) {
        if (aggregatedTaxes[tax.name + tax.rate]) {
          aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
        } else {
          aggregatedTaxes[tax.name + tax.rate] = { ...tax };
        }
      }
    }
  }
  return Object.values(aggregatedTaxes);
}

export function aggregateEcommerceItems(ecommerce: Ecommerce) {
  let aggregatedEcommerceItems: Item[] = [];
  if (ecommerce.invoice_level_line_items) {
    for (const item of ecommerce.invoice_level_line_items) {
      aggregatedEcommerceItems.push(item);
    }
  }
  if (ecommerce.shipments) {
    for (const shipment of ecommerce.shipments) {
      for (const item of shipment.items) {
        aggregatedEcommerceItems.push(item);
      }
    }
  }
  return aggregatedEcommerceItems;
}

export function someItemsGrouped(items: Item[]) {
  const hasGroup = (item: Item) => item.group != null;
  return items.some(hasGroup);
}

export function groupItems(items: Item[]) {
  const groupedItems: Record<string, Item[]> = {};
  for (const item of items) {
    if (groupedItems[item.group || "other"]) {
      groupedItems[item.group || "other"].push(item);
    } else {
      groupedItems[item.group || "other"] = [item];
    }
  }
  return groupedItems;
}

export function aggregateAdjustments(itemization: Itemization) {
  if (itemization.transit_route) {
    return itemization.transit_route.invoice_level_adjustments;
  }
  if (itemization.subscription) {
    return itemization.subscription.invoice_level_adjustments;
  }
  if (itemization.flight) {
    return itemization.flight.invoice_level_adjustments;
  }
  if (itemization.car_rental) {
    return itemization.car_rental.invoice_level_adjustments;
  }
  if (itemization.lodging) {
    return itemization.lodging.invoice_level_adjustments;
  }
  if (itemization.ecommerce) {
    return itemization.ecommerce.invoice_level_adjustments;
  }
  if (itemization.general) {
    return itemization.general.invoice_level_adjustments;
  }
  return null;
}

interface OrganizedTransitRoutePassenger {
  passenger: string | null;
  fare: number;
  passenger_metadata: ItemMetadata[];
}

interface OrganizedTransitRoute {
  departure_location: null | Place;
  arrival_location: null | Place;
  departure_at: number | null;
  arrival_at: number | null;
  polyline: null | string;
  shared_metadata: ItemMetadata[];
  passenger_count: number;
  passengers: OrganizedTransitRoutePassenger[];
  mode?: ("car" | "taxi" | "rail" | "bus" | "ferry" | "other") | null;
}

// TODO the checking of shared metadata against just the first passenger
// is sufficient since *any* deviation will cause the field to be broken out
// even if all the remaining passengers have the same value
export function organizeTransitRoutes(
  transitRoute: TransitRoute
): OrganizedTransitRoute[] {
  const organizedRoutes: Record<string, OrganizedTransitRoute> = {};

  const allPassengerMetadata: Record<string, Record<string, string>> = {};
  let doNotShareMetadata = false;
  const nonSharedKeys: Set<string> = new Set();

  for (const item of transitRoute.transit_route_items) {
    const {
      departure_location,
      arrival_location,
      departure_at,
      arrival_at,
      polyline,
      mode,
    } = item;
    const dedupeKey = canonicalize(
      JSON.stringify({
        departure_location,
        arrival_location,
        departure_at,
        arrival_at,
      })
    ) as string;
    if (organizedRoutes[dedupeKey]) {
      organizedRoutes[dedupeKey].passenger_count++;
      if (item.passenger) {
        allPassengerMetadata[item.passenger] = {};
        if (!item.metadata) {
          // if one item is missing metadata, we cannot group by metadata
          doNotShareMetadata = true;
          continue;
        }
        for (const metadata of item.metadata) {
          allPassengerMetadata[item.passenger][metadata.key] = metadata.value;
          for (const shared_metadata of organizedRoutes[dedupeKey]
            .shared_metadata) {
            if (metadata.key == shared_metadata.key) {
              if (metadata.value == shared_metadata.value) {
                break;
              } else {
                nonSharedKeys.add(metadata.key);
                // remove this key from shared metadata and move to other passengers
              }
            }
          }
        }
        organizedRoutes[dedupeKey].passengers.push({
          passenger: item.passenger,
          fare: item.fare,
          passenger_metadata: [],
        });
      }
    } else {
      if (item.passenger && item.metadata) {
        allPassengerMetadata[item.passenger] = {};
        for (const metadata of item.metadata) {
          allPassengerMetadata[item.passenger][metadata.key] = metadata.value;
        }
      }
      organizedRoutes[dedupeKey] = {
        departure_location,
        arrival_location,
        departure_at,
        arrival_at,
        polyline,
        shared_metadata: item.metadata || [],
        passenger_count: 1,
        passengers: [
          {
            passenger: item.passenger,
            fare: item.fare,
            passenger_metadata: [],
          },
        ],
        mode,
      };
    }
  }
  if (doNotShareMetadata) {
    for (const route of Object.values(organizedRoutes)) {
      for (const metadata of route.shared_metadata) {
        nonSharedKeys.add(metadata.key);
      }
    }
  }
  for (const key of Array.from(nonSharedKeys)) {
    // remove from shared metadata and add back to each passenger
    for (const route of Object.values(organizedRoutes)) {
      for (const passenger of route.passengers) {
        if (!passenger.passenger) {
          continue;
        }
        if (allPassengerMetadata[passenger.passenger]) {
          passenger.passenger_metadata.push({
            key,
            value: allPassengerMetadata[passenger.passenger][key],
          });
        }
      }
      route.shared_metadata = route.shared_metadata.filter(
        (metadata) => metadata.key != key
      );
    }
  }

  return Object.values(organizedRoutes);
}

interface OrganizedFlightTicketPassenger {
  passenger: string | null;
}

interface OrganizedFlightTicket {
  segments: FlightSegment[];
  passenger_count: number;
  passengers: OrganizedFlightTicketPassenger[];
}

export function organizeFlightTickets(flight: Flight): OrganizedFlightTicket[] {
  const organizedTickets: Record<string, OrganizedFlightTicket> = {};
  for (const ticket of flight.tickets) {
    const { segments } = ticket;
    const dedupeKey = canonicalize(
      JSON.stringify({
        segments,
      })
    ) as string;
    if (organizedTickets[dedupeKey]) {
      organizedTickets[dedupeKey].passenger_count++;
      if (ticket.passenger) {
        organizedTickets[dedupeKey].passengers.push({
          passenger: ticket.passenger,
        });
      }
    } else {
      organizedTickets[dedupeKey] = {
        segments,
        passenger_count: 1,
        passengers: [
          {
            passenger: ticket.passenger,
          },
        ],
      };
    }
  }
  return Object.values(organizedTickets);
}

export function aggregateTicketFares(ticket: OrganizedFlightTicket) {
  let aggregatedTicketFares: number = 0;
  for (const segment of ticket.segments) {
    aggregatedTicketFares += segment.fare;
  }
  return aggregatedTicketFares;
}
