import {
  Itemization,
  Tax,
  Flight,
  Item,
  Ecommerce,
  Address,
  Place,
  Metadatum,
  TransitRoute,
  FlightSegment,
  Adjustment,
  FlightTicket,
  Receipt,
  Person,
} from "@versa/schema";
import canonicalize from "canonicalize";
import {
  formatDateTimeWithPlaces,
  formatTimeRange,
  airportLookup,
  flightClass,
  capitalize,
  formatTransactionValue,
} from "./format";
import { airports } from "./airports";
import { Optional } from ".";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Helper to get a string identifier for a passenger (supports both string and Person types)
export function formatPassengerName(passenger: Optional<Person>): string {
  if (!passenger) return "";
  if (typeof passenger === "string") return passenger;
  const parts = [];
  if (passenger.first_name) {
    parts.push(passenger.first_name);
  } else if (passenger.preferred_first_name) {
    parts.push(passenger.preferred_first_name);
  }
  if (passenger.last_name) {
    parts.push(passenger.last_name);
  }
  return parts.join(" ") || passenger.email || "";
}

export function formatPhoneNumber(phone_number: string) {
  const parsedPhoneNumber = parsePhoneNumberFromString(phone_number);
  if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
    return phone_number;
  }
  return parsedPhoneNumber.country === "US"
    ? parsedPhoneNumber.formatNational()
    : parsedPhoneNumber.formatInternational();
}

// Helper to safely get passenger metadata (handles both string and Person types)
function getPassengerMetadata(passenger: any): Metadatum[] {
  if (!passenger || typeof passenger === "string") return [];
  return passenger.metadata || [];
}

// Internal helper function
function getPassengerIdentifier(passenger: Optional<Person>): string {
  return formatPassengerName(passenger);
}

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
  if (itemization.service) {
    for (const service_item of itemization.service.service_items) {
      for (const tax of service_item.taxes || []) {
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
      if (ticket.taxes && ticket.taxes.length > 0) {
        for (const tax of ticket.taxes) {
          if (aggregatedTaxes[tax.name + tax.rate]) {
            aggregatedTaxes[tax.name + tax.rate].amount += tax.amount;
          } else {
            aggregatedTaxes[tax.name + tax.rate] = { ...tax };
          }
        }
        continue;
      }
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
    for (const item of itemization.general.items) {
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
  const aggregatedEcommerceItems: Item[] = [];
  if (
    ecommerce.invoice_level_line_items &&
    ecommerce.invoice_level_line_items.length > 0
  ) {
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

export function aggregateAdjustments(
  itemization: Itemization
): Adjustment[] | null {
  if (itemization.transit_route) {
    return itemization.transit_route.invoice_level_adjustments || null;
  }
  if (itemization.service) {
    return itemization.service.invoice_level_adjustments || null;
  }
  if (itemization.subscription) {
    return itemization.subscription.invoice_level_adjustments || null;
  }
  if (itemization.flight) {
    const adjustments = [
      ...(itemization.flight.invoice_level_adjustments || []),
    ];
    itemization.flight.tickets.forEach((ticket) => {
      ticket.segments.forEach((segment) => {
        segment.adjustments?.forEach((adj) => {
          adjustments.push({
            amount: adj.amount,
            adjustment_type: adj.adjustment_type,
            name: `${adjustmentDescription(adj)} (${formatPassengerName(
              ticket.passenger
            )} / ${segment.departure_airport_code}-${
              segment.arrival_airport_code
            })`,
            rate: adj.rate,
          });
        });
      });
    });
    return adjustments;
  }
  if (itemization.car_rental) {
    return itemization.car_rental.invoice_level_adjustments || null;
  }
  if (itemization.lodging) {
    return itemization.lodging.invoice_level_adjustments || null;
  }
  if (itemization.ecommerce) {
    return itemization.ecommerce.invoice_level_adjustments || null;
  }
  if (itemization.general) {
    return itemization.general.invoice_level_adjustments || null;
  }
  return null;
}

interface OrganizedTransitRoutePassenger {
  passenger: Optional<Person>;
  fare: number;
  passenger_metadata: Metadatum[];
}

interface OrganizedTransitRoute {
  departure_location: Optional<Place>;
  arrival_location: Optional<Place>;
  departure_at: Optional<number>;
  arrival_at: Optional<number>;
  polyline: Optional<string>;
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
        const passengerId = getPassengerIdentifier(item.passenger);
        allPassengerMetadata[passengerId] = {};
        if (!item.metadata) {
          // if one item is missing metadata, we cannot group by metadata
          doNotShareMetadata = true;
          continue;
        }
        for (const metadata of item.metadata) {
          allPassengerMetadata[passengerId][metadata.key] = metadata.value;
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
        const passengerId = getPassengerIdentifier(item.passenger);
        allPassengerMetadata[passengerId] = {};
        for (const metadata of item.metadata) {
          allPassengerMetadata[passengerId][metadata.key] = metadata.value;
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
        const passengerId = getPassengerIdentifier(passenger.passenger);
        if (allPassengerMetadata[passengerId]) {
          passenger.passenger_metadata.push({
            key,
            value: allPassengerMetadata[passengerId][key],
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
  fare: number;
  passenger: Optional<Person>;
  ticket_number: Optional<string>;
  ticket_class: string | null; // only used if all class values are equal for ticket
  passenger_metadata: Metadatum[];
  record_locator: Optional<string>;
}

interface OrganizedFlightTicket {
  itineraries: GroupedItinerary[];
  passenger_count: number;
  passengers: OrganizedFlightTicketPassenger[];
}

const maxLayoverLength = 8 * 60 * 60;

function dateStringFromUnixWithTimezone(
  unix_timestamp: number,
  tz: Optional<string>
) {
  const utcDate = new Date(unix_timestamp * 1000);
  const timezone = tz || "UTC";
  const adjustedDate = new Date(
    utcDate.toLocaleDateString("en-US", {
      timeZone: timezone,
    })
  );
  return adjustedDate.toISOString().split("T")[0];
}

export interface GroupedItinerary {
  departure_at: Optional<number>;
  departure_tz: string | null;
  departure_date: string; // YYYY-MM-DD
  arrival_date: string; // YYYY-MM-DD
  departure_city: string;
  arrival_city: string;
  segments: FlightSegment[];
}

function lookupTimezoneFromAirportCode(airportCode: keyof typeof airports) {
  const airport = airports[airportCode];
  return airport?.tz || null;
}

// Not only does this restructure the flight segments into groups by date and passenger;
// it also ensures that departure tz and arrival tz are populated on each segment by
// looking up the tz with the airport code if the tz is null.
export function organizeSegmentedItineraries(
  segments: FlightSegment[]
): GroupedItinerary[] {
  const sortedSegments: FlightSegment[] = segments.sort(
    (a, b) => (a.departure_at || 0) - (b.departure_at || 0)
  );

  const groupedItineraries: GroupedItinerary[] = [];

  // numbered itinerary to departure date mapping
  const itineraryKeys: Record<number, string> = {};
  let itineraryKey = 0;
  for (const segment of sortedSegments) {
    if (!segment.departure_tz) {
      segment.departure_tz = lookupTimezoneFromAirportCode(
        segment.departure_airport_code as keyof typeof airports
      );
    }
    if (!segment.arrival_tz) {
      segment.arrival_tz = lookupTimezoneFromAirportCode(
        segment.arrival_airport_code as keyof typeof airports
      );
    }
    if (groupedItineraries[itineraryKey]?.segments?.length) {
      const previousSegment =
        groupedItineraries[itineraryKey].segments[
          groupedItineraries[itineraryKey].segments.length - 1
        ];
      if (
        (previousSegment.departure_at || 0) + maxLayoverLength <
        (segment.departure_at || 0)
      ) {
        // we've reached the end of one "itinerary"
        groupedItineraries[itineraryKey].arrival_city = airportLookup(
          previousSegment.arrival_airport_code
        ).municipality;
        groupedItineraries[itineraryKey].arrival_date =
          previousSegment.arrival_at
            ? dateStringFromUnixWithTimezone(
                previousSegment.arrival_at,
                previousSegment.arrival_tz
              )
            : "";
        itineraryKey++;
      }
    }

    if (!groupedItineraries[itineraryKey]) {
      // get day from departure_at and timezone
      const dateKey = dateStringFromUnixWithTimezone(
        segment.departure_at || 0,
        segment.departure_tz
      );

      itineraryKeys[itineraryKey] = dateKey;
      groupedItineraries.push({
        departure_at: segment.departure_at || null,
        departure_tz: segment.departure_tz || null,
        departure_date: dateKey,
        arrival_date: "",
        departure_city: airportLookup(segment.departure_airport_code)
          .municipality,
        arrival_city: "",
        segments: [segment],
      });
    } else {
      groupedItineraries[itineraryKey].segments.push(segment);
    }
  }

  const finalSegment = segments[segments.length - 1];
  if (groupedItineraries[itineraryKey]) {
    (groupedItineraries[itineraryKey].arrival_city = airportLookup(
      finalSegment.arrival_airport_code
    ).municipality),
      (groupedItineraries[itineraryKey].arrival_date = finalSegment.arrival_at
        ? dateStringFromUnixWithTimezone(
            finalSegment.arrival_at,
            finalSegment.arrival_tz
          )
        : "");
  }

  return Object.values(groupedItineraries);
}

function uniqueSegment(segment: FlightSegment) {
  return {
    departure_airport_code: segment.departure_airport_code,
    arrival_airport_code: segment.arrival_airport_code,
    departure_at: segment.departure_at,
    arrival_at: segment.arrival_at,
    departure_tz: segment.departure_tz,
    arrival_tz: segment.arrival_tz,
    flight_number: segment.flight_number,
  };
}

export function organizeFlightTickets(flight: Flight): OrganizedFlightTicket[] {
  const organizedTickets: Record<string, OrganizedFlightTicket> = {};
  for (const ticket of flight.tickets) {
    const { segments } = ticket;
    const dedupeKey = canonicalize(
      JSON.stringify({
        segments: segments.map(uniqueSegment),
      })
    ) as string;
    const allClassValuesEqualForPassenger = allClassValuesEqual(segments);

    const passengerMetadata = getPassengerMetadata(ticket.passenger);
    const passengerKey =
      ticket.passenger || ticket.record_locator || passengerMetadata.length;

    if (organizedTickets[dedupeKey]) {
      organizedTickets[dedupeKey].passenger_count++;
      if (passengerKey) {
        organizedTickets[dedupeKey].passengers.push({
          fare: determineTicketFare(ticket),
          passenger: ticket.passenger,
          record_locator: ticket.record_locator || null,
          ticket_number: ticket.number,
          ticket_class: allClassValuesEqualForPassenger
            ? segments[0].class_of_service || null
            : null,
          passenger_metadata: passengerMetadata,
        });
      }
    } else {
      organizedTickets[dedupeKey] = {
        itineraries: organizeSegmentedItineraries(segments),
        passenger_count: 1,
        passengers: [
          {
            fare: determineTicketFare(ticket),
            passenger: ticket.passenger,
            record_locator: ticket.record_locator || null,
            ticket_number: ticket.number,
            ticket_class: allClassValuesEqualForPassenger
              ? segments[0].class_of_service || null
              : null,
            passenger_metadata: passengerMetadata,
          },
        ],
      };
    }
  }
  return Object.values(organizedTickets);
}

export function determineTicketFare(ticket: FlightTicket) {
  if (ticket.fare !== null && ticket.fare !== undefined) {
    return ticket.fare;
  }
  let aggregatedTicketFares: number = 0;
  for (const segment of ticket.segments) {
    aggregatedTicketFares += segment.fare || 0;
  }
  return aggregatedTicketFares;
}

// For PDF Export

type pdfItem = Record<
  string,
  { content: string; styles?: { [key: string]: any } }
>;

export function aggregateItems(
  itemization: Itemization,
  header: Receipt["header"]
) {
  let items: pdfItem[] = [];
  let head: pdfItem = {};
  head = aggregateItemHeaders(itemization);

  // Transit Route
  if (itemization.transit_route) {
    itemization.transit_route.transit_route_items.forEach((i) => {
      const row: { [key: string]: any } = {};
      Object.keys(head).forEach((key) => {
        if (key == "departure") {
          let departureString = "";
          if (i.departure_location) {
            departureString = formatPlaceSingleLine(i.departure_location);
            if (i.departure_at) {
              departureString =
                departureString +
                "\n" +
                formatDateTimeWithPlaces(
                  i.departure_at,
                  [i.departure_location, header.location],
                  {
                    includeTime: true,
                  }
                );
            }
          }
          row.departure = { content: departureString };
        } else if (key == "arrival") {
          let arrivalString = "";
          if (i.arrival_location) {
            arrivalString = formatPlaceSingleLine(i.arrival_location);
            if (i.arrival_at) {
              arrivalString =
                arrivalString +
                "\n" +
                formatDateTimeWithPlaces(
                  i.arrival_at,
                  [i.arrival_location, header.location],
                  {
                    includeTime: true,
                  }
                );
            }
          }
          row.arrival = { content: arrivalString };
        } else if (key == "fare") {
          row.fare = {
            content: formatTransactionValue(i.fare, header.currency),
            styles: {
              halign: "right",
              cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
            },
          };
        }
      });
      items.push(row);
    });
  }

  // Service
  if (itemization.service) {
    itemization.service.service_items.forEach((i) => {
      const row: { [key: string]: any } = {};
      Object.keys(head).forEach((key) => {
        if (key == "description") {
          let descriptionString: string = "";
          descriptionString = i.description;
          if (i.current_period_start_at && i.current_period_end_at) {
            descriptionString = descriptionString.concat(
              "\n",
              formatTimeRange(
                i.current_period_start_at,
                i.current_period_end_at
              )
            );
          }
          row.description = { content: descriptionString };
        } else if (key == "amount") {
          row.amount = {
            content: formatTransactionValue(i.amount, header.currency),
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
            content: i.unit_cost
              ? formatTransactionValue(i.unit_cost, header.currency)
              : "",
            styles: { halign: "right" },
          };
        } else if (key == "taxes" && i.taxes) {
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

  // Subscription
  if (itemization.subscription) {
    itemization.subscription.subscription_items.forEach((i) => {
      const row: { [key: string]: any } = {};
      Object.keys(head).forEach((key) => {
        if (key == "description") {
          let descriptionString: string = "";
          descriptionString = i.description;
          if (i.current_period_start_at && i.current_period_end_at) {
            descriptionString = descriptionString.concat(
              "\n",
              formatTimeRange(
                i.current_period_start_at,
                i.current_period_end_at
              )
            );
          }
          row.description = { content: descriptionString };
        } else if (key == "amount") {
          row.amount = {
            content: formatTransactionValue(i.amount, header.currency),
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
            content: i.unit_cost
              ? formatTransactionValue(i.unit_cost, header.currency)
              : "",
            styles: { halign: "right" },
          };
        } else if (key == "taxes" && i.taxes) {
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

  // Flight
  if (itemization.flight) {
    // Rough
    const organizedFlightTickets = organizeFlightTickets(itemization.flight);
    organizedFlightTickets.forEach((t) =>
      t.passengers.forEach((p) =>
        items.push({
          passenger: {
            content: p.passenger ? getPassengerIdentifier(p.passenger) : "",
          },
          fare: {
            content: formatTransactionValue(p.fare, header.currency),
            styles: {
              halign: "right",
              cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
            },
          },
        })
      )
    );
  }

  // Car Rental
  if (itemization.car_rental) {
    items = aggregateGenericItemRows(
      itemization.car_rental.items,
      head,
      header
    );
  }

  // Lodging
  if (itemization.lodging) {
    items = aggregateGenericItemRows(itemization.lodging.items, head, header);
  }

  // Ecommerce
  if (itemization.ecommerce) {
    items = aggregateGenericItemRows(
      aggregateEcommerceItems(itemization.ecommerce),
      head,
      header
    );
  }

  // General
  if (itemization.general) {
    items = aggregateGenericItemRows(itemization.general.items, head, header);
  }

  // Remove the bottom border from the last item
  for (const key in items[items.length - 1]) {
    if (Object.prototype.hasOwnProperty.call(items[items.length - 1], key)) {
      const item = items[items.length - 1][key];
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

function aggregateItemHeaders(itemization: Itemization): pdfItem {
  let head: pdfItem = {};

  // Transit
  if (itemization.transit_route) {
    head.departure = { content: "Departure" };
    head.arrival = { content: "Arrival" };
    // todo: handle metadata
    head.fare = {
      content: "Fare",
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    };
  }

  // Service
  if (itemization.service) {
    head = { description: { content: "Description" } };
    itemization.service.service_items.forEach((i) => {
      if (i.quantity !== null && !head.quantity) {
        head.quantity = { content: "Qty", styles: { halign: "right" } };
        head.unit_cost = { content: "Unit Price", styles: { halign: "right" } };
      }
    });
    itemization.service.service_items.forEach((i) => {
      if (i.metadata && i.metadata.length > 0) {
        i.metadata.forEach((m) => {
          if (!head[m.key]) {
            head[m.key] = { content: m.key };
          }
        });
      }
    });
    const allTaxesAreRateBased = itemization.service.service_items.every(
      (i) => i.taxes && i.taxes.every((t) => t.rate !== null)
    );
    if (allTaxesAreRateBased) {
      head.taxes = { content: "Tax", styles: { halign: "right" } };
    }
    head.amount = {
      content: "Amount",
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    };
  }

  // Subscription
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
    head.amount = {
      content: "Amount",
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    };
  }

  // Flight
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

  // Car Rental
  if (itemization.car_rental) {
    head = aggregateGenericItemHeaders(itemization.car_rental.items);
  }

  // Lodging
  if (itemization.lodging) {
    head = aggregateGenericItemHeaders(itemization.lodging.items);
  }

  // Ecommerce
  if (itemization.ecommerce) {
    head = aggregateGenericItemHeaders(
      aggregateEcommerceItems(itemization.ecommerce)
    );
  }

  // General
  if (itemization.general) {
    head = aggregateGenericItemHeaders(itemization.general.items);
  }
  return head;
}

function aggregateGenericItemHeaders(rows: Item[]): pdfItem {
  const head: pdfItem = {};
  rows.forEach((i) => {
    if (i.date && !head.date) {
      head.date = { content: "Date" };
    }
  });
  head.description = { content: "Description" };
  rows.forEach((i) => {
    if (i.quantity !== null && !head.quantity) {
      head.quantity = { content: "Qty", styles: { halign: "right" } };
      head.unit_cost = { content: "Unit Price", styles: { halign: "right" } };
    }
  });
  // Cap metadata columns to 2
  const metadataKeys = new Set<string>();
  rows.forEach((i) => {
    if (i.metadata && i.metadata.length > 0) {
      i.metadata.forEach((m) => {
        if (metadataKeys.size < 2 && !metadataKeys.has(m.key)) {
          metadataKeys.add(m.key);
          if (!head[m.key]) {
            head[m.key] = { content: m.key };
          }
        }
      });
    }
  });
  rows.forEach((i) => {
    if (i.unspsc && !head.unspsc) {
      head.unspsc = { content: "UNSPSC" };
    }
  });
  if (rows.every((i) => i.taxes && i.taxes.every((t) => t.rate !== null))) {
    head.taxes = { content: "Tax", styles: { halign: "right" } };
  }
  head.amount = {
    content: "Amount",
    styles: {
      halign: "right",
      cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
    },
  };
  // Handle groups
  return head;
}

function aggregateGenericItemRows(
  rows: Item[],
  head: pdfItem,
  header: Receipt["header"]
): pdfItem[] {
  const items: pdfItem[] = [];
  rows.forEach((i) => {
    const row: { [key: string]: any } = {};
    Object.keys(head).forEach((key) => {
      if (key == "date") {
        row.date = {
          content: i.date ? formatISODate(i.date.toString()) : "",
        };
      } else if (key == "description") {
        let descriptionString: string = "";
        descriptionString = i.description;
        if (i.adjustments && i.adjustments.length > 0) {
          i.adjustments.forEach((a) => {
            let adjustmentString = "";
            if (a.name) {
              adjustmentString += a.name + " applied";
            } else {
              adjustmentString +=
                capitalize(a.adjustment_type.replaceAll("_", " ")) + " applied";
            }
            if (a.rate) {
              adjustmentString += " (" + a.rate * 100 + "%)";
            } else {
              adjustmentString +=
                " (" + formatTransactionValue(a.amount, header.currency) + ")";
            }
            descriptionString = descriptionString.concat(
              "\n" + adjustmentString
            );
          });
        }
        row.description = { content: descriptionString };
      } else if (key == "amount") {
        row.amount = {
          content: formatTransactionValue(i.amount, header.currency),
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
          content: i.unit_cost
            ? formatTransactionValue(i.unit_cost, header.currency)
            : "",
          styles: { halign: "right" },
        };
      } else if (key == "taxes" && i.taxes) {
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
  return items;
}

// (removed deprecated stringifyPlace)

// Address/Place formatting helpers
export interface FormatAddressOptions {
  includeStreet?: boolean;
  includePostalCode?: boolean;
  includeCountry?: boolean;
}

function _cleanAddressPart(value?: string | null): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.replace(/\s+/g, " ") : "";
}

/**
 * Returns a single-line, human-friendly address string.
 * - Skips empty parts to avoid stray commas/spaces
 * - Formats as: "street, City, Region Postal[, Country?]"
 * - Country is included by default only if present and not US
 */
export function formatAddress(
  address?: Optional<Address>,
  options?: FormatAddressOptions
): string {
  if (!address) return "";

  const includeStreet = options?.includeStreet !== false;
  const includePostal = options?.includePostalCode !== false;

  const street = includeStreet ? _cleanAddressPart(address.street_address) : "";
  const city = _cleanAddressPart(address.city as string | undefined);
  const region = _cleanAddressPart(address.region as string | undefined);
  const postal = includePostal
    ? _cleanAddressPart(address.postal_code as string | undefined)
    : "";
  const country = _cleanAddressPart(address.country as string | undefined);

  // City, Region Postal
  let cityRegionPostal = "";
  if (city && region) {
    cityRegionPostal = postal
      ? `${city}, ${region} ${postal}`
      : `${city}, ${region}`;
  } else if (city) {
    cityRegionPostal = city;
  } else if (region) {
    cityRegionPostal = postal ? `${region} ${postal}` : region;
  } else {
    cityRegionPostal = postal;
  }

  const shouldIncludeCountry =
    options?.includeCountry ?? (country ? !/^US$/i.test(country) : false);

  const parts: string[] = [];
  if (street) parts.push(street);
  if (cityRegionPostal) parts.push(cityRegionPostal);
  if (shouldIncludeCountry && country) parts.push(country);

  return parts.join(", ");
}

/**
 * Multi-line address friendly for stacked display:
 * - Line 1: street (if present)
 * - Line 2: City, Region Postal (if present)
 * - Line 3: Country (if present)
 */
export function formatAddressMultiline(address?: Optional<Address>): string {
  if (!address) return "";
  const lines: string[] = [];
  const street = _cleanAddressPart(
    address.street_address as string | undefined
  );
  if (street) lines.push(street);
  const cityRegionPostal = formatAddress(address, {
    includeStreet: false,
    includeCountry: false,
    includePostalCode: true,
  });
  if (cityRegionPostal) lines.push(cityRegionPostal);
  const country = _cleanAddressPart(address.country as string | undefined);
  if (country) lines.push(country);
  return lines.join("\n");
}

/**
 * Single-line place formatter: "Name, Address"
 * - Uses address without country and postal code by default for compactness
 */
export function formatPlaceSingleLine(place?: Optional<Place>): string {
  if (!place) return "";
  const name = _cleanAddressPart(place.name as string | undefined);
  const addr = formatAddress(place.address, {
    includeStreet: true,
    includePostalCode: false,
    includeCountry: false,
  });
  if (name && addr) return `${name}, ${addr}`;
  return name || addr || "";
}
function formatISODate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function allClassValuesEqual(segments: FlightSegment[]): boolean {
  if (segments.length === 0) return false;
  const firstValue = segments[0].class_of_service;
  return (
    firstValue !== null &&
    segments.every((s) => s.class_of_service === firstValue)
  );
}

export function aggregateFlight(
  organizedTicket: OrganizedFlightTicket,
  header: Receipt["header"]
) {
  const organized_ticket: pdfItem[] = [];
  let organized_ticket_head: pdfItem = {};
  organized_ticket_head = aggregateFlightHeaders(organizedTicket.passengers);
  organizedTicket.passengers.forEach((p) => {
    const row: { [key: string]: any } = {};
    row.passenger = { content: getPassengerIdentifier(p.passenger) };
    row.ticket_number = { content: p.ticket_number };
    row.record_locator = { content: p.record_locator };
    if (p.ticket_class && flightClass(p.ticket_class)) {
      const class_string =
        flightClass(p.ticket_class) + " (" + p.ticket_class + ")";
      row.ticket_class = { content: class_string };
    } else {
      row.ticket_class = { content: p.ticket_class };
    }
    row.fare = {
      content: formatTransactionValue(p.fare, header.currency),
      styles: {
        halign: "right",
        cellPadding: { top: 0.125, right: 0, bottom: 0.125, left: 0 },
      },
    };
    p.passenger_metadata.forEach((m) => {
      row[m.key] = { content: m.value };
    });
    organized_ticket.push(row);
  });
  return { organized_ticket_head, organized_ticket };
}
function aggregateFlightHeaders(
  passengers: OrganizedFlightTicketPassenger[]
): pdfItem {
  const ticketSummaryHead: pdfItem = {};
  if (passengers.every((value) => value.passenger != null)) {
    ticketSummaryHead.passenger = { content: "Passenger" };
  }
  const metadata_headers = new Set<string>();
  for (const passenger of passengers) {
    passenger.passenger_metadata.forEach((passenger_metadatum) => {
      metadata_headers.add(passenger_metadatum.key);
    });
  }
  metadata_headers.forEach((header) => {
    ticketSummaryHead[header] = { content: header };
  });
  if (passengers.some((value) => value.record_locator != null)) {
    ticketSummaryHead.record_locator = { content: "Confirmation Code" };
  }
  if (passengers.some((value) => value.ticket_number != null)) {
    ticketSummaryHead.ticket_number = { content: "Ticket" };
  }
  if (passengers.every((value) => value.ticket_class != null)) {
    ticketSummaryHead.ticket_class = { content: "Class" };
  }
  ticketSummaryHead.fare = {
    content: "Fare",
    styles: {
      halign: "right",
      cellPadding: {
        top: 0.09375,
        right: 0,
        bottom: 0.09375,
        left: 0,
      },
    },
  };
  return ticketSummaryHead;
}

export function netAdjustments(adjustments: Adjustment[] | undefined): number {
  let net = 0;
  if (adjustments) {
    adjustments.forEach((a) => {
      net += a.amount;
    });
  }
  return net;
}

function adjustmentDescription(adj: Adjustment) {
  if (adj.name) {
    return adj.name;
  }
  return capitalize(adj.adjustment_type.replaceAll("_", " "));
}
