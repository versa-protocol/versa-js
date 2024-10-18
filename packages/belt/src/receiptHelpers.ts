import {
  Itemization,
  Tax,
  Flight,
  Item,
  Ecommerce,
  Place,
  Metadatum,
  TransitRoute,
  FlightSegment,
} from "@versaprotocol/schema";
import canonicalize from "canonicalize";
import { formatTimeRange, formatUSD } from "./format";

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
    for (const item of itemization.lodging.items) {
      for (const tax of item.taxes || []) {
        if (aggregatedTaxes[tax.name + tax.rate]) {
          aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
        } else {
          aggregatedTaxes[tax.name + tax.rate] = { ...tax };
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

export function someItemsWithDate(items: Item[]) {
  const hasDate = (item: Item) => item.date != null;
  return items.some(hasDate);
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

export function sortItemsByDate(items: Item[]) {
  const sortedItems: Record<string, Item[]> = {};
  const sorted = items.sort((a, b) => {
    if (a.date === null && b.date === null) return 0;
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
  });
  sorted.forEach((item) => {
    const dateKey = item.date ?? "other";
    if (!sortedItems[dateKey]) {
      sortedItems[dateKey] = [];
    }
    sortedItems[dateKey].push(item);
  });
  return sortedItems;
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
  passenger: string | null | undefined;
  fare: number;
  passenger_metadata: Metadatum[];
}

interface OrganizedTransitRoute {
  departure_location: null | Place | undefined;
  arrival_location: null | Place | undefined;
  departure_at: number | null | undefined;
  arrival_at: number | null | undefined;
  polyline: null | string | undefined;
  shared_metadata: Metadatum[];
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
  passenger: string | null | undefined;
}

interface OrganizedFlightTicket {
  segments: FlightSegment[];
  passenger_count: number;
  number: string | null | undefined;
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
        number: ticket.number,
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

export function aggregateItems(itemization: Itemization) {
  type Cell = { content: string; styles?: { [key: string]: any } };
  let items: Record<string, Cell>[] = [];
  let head: Record<string, Cell> = {};
  head = aggregateItemHeaders(itemization);

  if (itemization.transit_route) {
    // todo
  }
  if (itemization.subscription) {
    itemization.subscription.subscription_items.forEach((i) => {
      let row: { [key: string]: any } = {};
      Object.keys(head).forEach((key) => {
        if (key == "description") {
          let descriptionString: string = "";
          descriptionString = i.description;
          if (i.current_period_start && i.current_period_end) {
            descriptionString = descriptionString.concat(
              "\n",
              formatTimeRange(i.current_period_start, i.current_period_end)
            );
          }
          row.description = { content: descriptionString };
        } else if (key == "subtotal") {
          row.subtotal = {
            content: formatUSD(i.subtotal / 100),
            styles: {
              halign: "right",
              cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
            },
          };
          // todo: handle adjustments here
        } else if (key == "quantity") {
          row.quantity = {
            content: i.quantity ? i.quantity.toString() : "",
            styles: { halign: "right" },
          };
        } else if (key == "unit_cost") {
          row.unit_cost = {
            content: i.unit_cost ? formatUSD(i.unit_cost / 100) : "",
            styles: { halign: "right" },
          };
        } else if (key == "taxes") {
          let combinedTaxRate = 0;
          i.taxes.forEach((t) => {
            if (t.rate) {
              combinedTaxRate += t.rate;
            }
          });
          row.taxes = {
            content: combinedTaxRate * 100 + "%",
            styles: { halign: "right" },
          };
        } else {
          if (i.metadata && i.metadata.length > 0) {
            i.metadata.forEach((m) => {
              if (key == m.key) {
                row[m.key] = { content: m.value };
              }
            });
          }
        }
      });
      items.push(row);
    });
  }
  if (itemization.flight) {
    const organizedFlightTickets = organizeFlightTickets(itemization.flight);
    organizedFlightTickets.forEach((t) =>
      t.passengers.forEach((p) =>
        items.push({
          passenger: { content: p.passenger ? p.passenger : "" },
          ticket: { content: t.number ? t.number : "" },
          fare: {
            content: formatUSD(aggregateTicketFares(t) / 100),
            styles: {
              halign: "right",
              cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
            },
          },
        })
      )
    );
  }
  if (itemization.car_rental) {
    // todo
  }
  if (itemization.lodging) {
    itemization.lodging.items.forEach((l) =>
      items.push({
        date: { content: l.date ? l.date : "" },
        description: { content: l.description },
        subtotal: {
          content: formatUSD(l.subtotal / 100),
          styles: {
            halign: "right",
            cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
          },
        },
      })
    );
  }
  if (itemization.ecommerce) {
    // todo
  }
  if (itemization.general) {
    // todo
  }

  // Remove the bottom border from the last item
  for (const key in items[items.length - 1]) {
    if (items[items.length - 1].hasOwnProperty(key)) {
      const item = items[items.length - 1][key] as Cell;
      if (item.styles) {
        item.styles.lineWidth = {
          bottom: 0,
        };
      } else {
        item.styles = {
          lineWidth: {
            bottom: 0,
          },
        };
      }
    }
  }
  return { head, items };
}

function aggregateItemHeaders(itemization: Itemization) {
  type Cell = { content: string; styles?: { [key: string]: any } };
  let head: Record<string, Cell> = {};

  if (itemization.transit_route) {
    // todo
  }
  if (itemization.subscription) {
    head = { description: { content: "Description" } };
    itemization.subscription.subscription_items.forEach((i) => {
      if (i.quantity !== null && !head.quantity) {
        head.quantity = { content: "Qty", styles: { halign: "right" } };
        head.unit_cost = { content: "Unit Price", styles: { halign: "right" } };
      }
    });
    itemization.subscription.subscription_items.forEach((i) => {
      if (i.metadata && i.metadata.length > 0) {
        i.metadata.forEach((m) => {
          if (!head[m.key]) {
            head[m.key] = { content: m.key };
          }
        });
      }
    });
    const allTaxesAreRateBased =
      itemization.subscription.subscription_items.every(
        (i) => i.taxes && i.taxes.every((t) => t.rate !== null)
      );
    if (allTaxesAreRateBased) {
      head.taxes = { content: "Tax", styles: { halign: "right" } };
    }
    head.subtotal = {
      content: "Amount",
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    };
  }
  if (itemization.flight) {
    // Rough
    head = {
      passenger: { content: "Passenger" },
      ticket: { content: "Ticket Number" },
      fare: {
        content: "Fare",
        styles: {
          halign: "right",
          cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
        },
      },
    };
  }
  if (itemization.car_rental) {
    // todo
  }
  if (itemization.lodging) {
    head = aggregateGenericItemHeaders(itemization.lodging.items);
  }
  if (itemization.ecommerce) {
    let aggregatedEcommerceItems =
      itemization.ecommerce.invoice_level_line_items;
    if (
      itemization.ecommerce.shipments &&
      itemization.ecommerce.shipments.length > 0
    ) {
      itemization.ecommerce.shipments.forEach((s) => {
        aggregatedEcommerceItems.push(...s.items);
      });
    }
    head = aggregateGenericItemHeaders(aggregatedEcommerceItems);
  }
  if (itemization.general) {
    head = aggregateGenericItemHeaders(itemization.general.line_items);
  }
  return head;
}

function aggregateGenericItemHeaders(items: Item[]) {
  type Cell = { content: string; styles?: { [key: string]: any } };
  let head: Record<string, Cell> = {};
  items.forEach((i) => {
    if (i.date !== null && !head.date) {
      head.date = { content: "Date" };
    }
  });
  head.description = { content: "Description" };
  items.forEach((i) => {
    if (i.quantity !== null && !head.quantity) {
      head.quantity = { content: "Qty", styles: { halign: "right" } };
      head.unit_cost = { content: "Unit Price", styles: { halign: "right" } };
    }
  });
  items.forEach((i) => {
    if (i.metadata && i.metadata.length > 0) {
      i.metadata.forEach((m) => {
        if (!head[m.key]) {
          head[m.key] = { content: m.key };
        }
      });
    }
  });
  items.forEach((i) => {
    if (i.unspsc && !head.unspsc) {
      head.unspsc = { content: "UNSPSC" };
    }
  });
  const allTaxesAreRateBased = items.every(
    (i) => i.taxes && i.taxes.every((t) => t.rate !== null)
  );
  if (allTaxesAreRateBased) {
    head.taxes = { content: "Tax", styles: { halign: "right" } };
  }
  head.subtotal = {
    content: "Amount",
    styles: {
      halign: "right",
      cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
    },
  };
  // Handle groups
  return head;
}
