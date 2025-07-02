import { Receipt } from "@versa/schema";
import {
  aggregateTaxes,
  determineTicketFare,
  organizeFlightTickets,
  organizeSegmentedItineraries,
  organizeTransitRoutes,
} from "./receiptHelpers";

import { receipts } from "@versa/examples";

const railReceipt = receipts.rail;

const testData = {
  general: null,
  lodging: null,
  ecommerce: null,
  car_rental: null,
  transit_route: null,
  subscription: null,
  flight: {
    tickets: [
      {
        fare: 123, // silly data, but an important edgecase to test
        taxes: [],
        metadata: [],
        segments: [
          {
            fare: 15233,
            metadata: [],
            departure_airport_code: "SEA",
            arrival_airport_code: "MSP",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "DL 1768",
            class_of_service: "t",
            taxes: [
              {
                amount: 1142,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 280,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 450,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
          {
            fare: 12186,
            metadata: [],
            departure_airport_code: "MSP",
            arrival_airport_code: "GFK",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "OO 4656",
            class_of_service: "t",
            taxes: [
              {
                amount: 914,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 224,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 360,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
          {
            fare: 14014,
            metadata: [],
            departure_airport_code: "GFK",
            arrival_airport_code: "MSP",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "OO 4656",
            class_of_service: "t",
            taxes: [
              {
                amount: 1051,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 258,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 414,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
          {
            fare: 19498,
            metadata: [],
            departure_airport_code: "MSP",
            arrival_airport_code: "SEA",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "DL 2536",
            class_of_service: "t",
            taxes: [
              {
                amount: 1462,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 358,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 576,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
        ],
        number: "0062698215636",
        record_locator: "CU9GEF",
        passenger: {
          preferred_first_name: "Jimmy",
          first_name: "James",
          last_name: "Dean",
          metadata: [],
        },
      },
      {
        taxes: [],
        segments: [
          {
            fare: 15233,
            metadata: [],
            departure_airport_code: "SEA",
            arrival_airport_code: "MSP",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "DL 1768",
            class_of_service: "t",
            taxes: [
              {
                amount: 15233,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 280,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 450,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
          {
            fare: 12186,
            metadata: [],
            departure_airport_code: "MSP",
            arrival_airport_code: "GFK",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "OO 4656",
            class_of_service: "t",
            taxes: [
              {
                amount: 914,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 224,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 360,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
          {
            fare: 14014,
            metadata: [],
            departure_airport_code: "GFK",
            arrival_airport_code: "MSP",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "OO 4656",
            class_of_service: "t",
            taxes: [
              {
                amount: 1051,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 258,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 414,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
          {
            fare: 19498,
            metadata: [],
            departure_airport_code: "MSP",
            arrival_airport_code: "SEA",
            departure_at: 1713196492,
            arrival_at: 1713197752,
            flight_number: "DL 2536",
            class_of_service: "t",
            taxes: [
              {
                amount: 1462,
                rate: 0.075,
                name: "US Transportation Tax",
              },
              {
                amount: 358,
                rate: null,
                name: "US September 11th Security Fee",
              },
              {
                amount: 576,
                rate: null,
                name: "US Passenger Facility Charge",
              },
              {
                amount: 400,
                rate: null,
                name: "US Flight Segment Tax",
              },
            ],
            adjustments: [],
          },
        ],
        number: "0062698215637",
        record_locator: "CU9GEF",
        passenger: {
          preferred_first_name: "John",
          first_name: "John",
          last_name: "Smith",
          metadata: [],
        },
      },
    ],
    itinerary_locator: "1122337694093",
    invoice_level_adjustments: [],
  },
};

describe("aggregateTaxes", () => {
  it("should work", () => {
    const result = aggregateTaxes(testData as any); // TODO
    expect(result[0].name).toBe("US Transportation Tax");
    expect(result[0].amount).toBe(23229);
    expect(result[3].name).toBe("US Flight Segment Tax");
    expect(result[3].amount).toBe(3200);
  });
});

describe("determineTicketFare", () => {
  const organizedTickets = organizeFlightTickets(testData.flight); // TODO
  // This is sort of just a reducer but that's fine
  it("should work", () => {
    const result = determineTicketFare(testData.flight.tickets[1]);
    expect(result).toBe(60931);
    expect(organizedTickets[0].passengers[0].fare).toBe(123);
    expect(organizedTickets[0].passengers[1].fare).toBe(60931);
  });
});

describe("organizeTransitRoutes", () => {
  it("should organized routes under a shared itinerary", () => {
    if (!railReceipt.itemization?.transit_route) {
      throw new Error("No transit routes found");
    }
    expect(
      railReceipt.itemization.transit_route.transit_route_items.length
    ).toBe(3);

    // FUNCTION WE'RE TESTING
    const reorganizedRoutes = organizeTransitRoutes(
      railReceipt.itemization.transit_route
    );
    expect(reorganizedRoutes.length).toBe(1);

    expect(reorganizedRoutes[0].shared_metadata.length).toBe(2);
    expect(reorganizedRoutes[0].shared_metadata[0]).toEqual({
      key: "Ticket",
      value: "1210653562276",
    });
    expect(reorganizedRoutes[0].shared_metadata[1]).toEqual({
      key: "Class",
      value: "Coach",
    });

    expect(reorganizedRoutes[0].passenger_count).toBe(3);
    expect(reorganizedRoutes[0].passengers.length).toBe(3);
    expect(reorganizedRoutes[0].passengers[0].passenger?.first_name).toBe(
      "Honora"
    );
    expect(reorganizedRoutes[0].passengers[0].passenger?.last_name).toBe("Doe");
    expect(reorganizedRoutes[0].passengers[0].fare).toBe(14500);
    expect(reorganizedRoutes[0].passengers[0].passenger_metadata.length).toBe(
      1
    );
    expect(reorganizedRoutes[0].passengers[0].passenger_metadata[0].key).toBe(
      "Category"
    );
    expect(reorganizedRoutes[0].passengers[0].passenger_metadata[0].value).toBe(
      "Adult"
    );

    expect(reorganizedRoutes[0].passengers[1].passenger?.first_name).toBe(
      "Ted"
    );
    expect(reorganizedRoutes[0].passengers[1].passenger?.last_name).toBe("Doe");
    expect(reorganizedRoutes[0].passengers[1].fare).toBe(14500);
    expect(reorganizedRoutes[0].passengers[1].passenger_metadata.length).toBe(
      1
    );
    expect(reorganizedRoutes[0].passengers[1].passenger_metadata[0].key).toBe(
      "Category"
    );
    expect(reorganizedRoutes[0].passengers[1].passenger_metadata[0].value).toBe(
      "Adult"
    );

    expect(reorganizedRoutes[0].passengers[2].passenger?.first_name).toBe(
      "Rita"
    );
    expect(reorganizedRoutes[0].passengers[2].passenger?.last_name).toBe("Doe");
    expect(reorganizedRoutes[0].passengers[2].fare).toBe(7250);
    expect(reorganizedRoutes[0].passengers[2].passenger_metadata.length).toBe(
      1
    );
    expect(reorganizedRoutes[0].passengers[2].passenger_metadata[0].key).toBe(
      "Category"
    );
    expect(reorganizedRoutes[0].passengers[2].passenger_metadata[0].value).toBe(
      "Child"
    );
  });
});

describe("organizeSegmentedItineraries", () => {
  it("should organized itineraries into two grouped itineraries for an outgoing itinerary and a return", () => {
    const receipt = receipts.flight as Receipt;

    const ticket = receipt?.itemization?.flight?.tickets[0];
    if (!ticket || !ticket.segments) {
      throw Error("Bad test data");
    }

    const organized = organizeSegmentedItineraries(ticket?.segments);

    expect(organized).toBeTruthy();
    expect(organized.length).toBe(2);
    expect(organized[0].departure_at).toBe(1713196492);
    expect(organized[0].departure_city).toBe("Seattle");
    expect(organized[0].arrival_city).toBe("Grand Forks");
    expect(organized[1].departure_at).toBe(1713900952);
    expect(organized[1].departure_city).toBe("Grand Forks");
    expect(organized[1].arrival_city).toBe("Seattle");
  });
});

describe("determineTicketFare", () => {
  // This is sort of just a reducer but that's fine
  it("should aggregate segment level data", () => {
    const result = determineTicketFare(testData.flight.tickets[1]);
    expect(result).toBe(60931);
  });
  it("should use ticket fare if populated", () => {
    const result = determineTicketFare(testData.flight.tickets[0]);
    expect(result).toBe(123);
  });
});
