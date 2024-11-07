import { lts } from "@versaprotocol/schema";
import {
  aggregateTaxes,
  aggregateTicketFares,
  organizeFlightTickets,
  organizeSegmentedItineraries,
  organizeTransitRoutes,
} from "./receiptHelpers";

import { receipts } from "@versaprotocol/examples";

const railReceipt = receipts.rail as unknown as lts.v1_5_1.Receipt;

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
        segments: [
          {
            fare: 15233,
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
            adjustments: null,
          },
          {
            fare: 12186,
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
            adjustments: null,
          },
          {
            fare: 14014,
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
            adjustments: null,
          },
          {
            fare: 19498,
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
            adjustments: null,
          },
        ],
        number: "0062698215636",
        record_locator: "CU9GEF",
        passenger: "Jimmy Dean",
      },
      {
        segments: [
          {
            fare: 15233,
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
            adjustments: null,
          },
          {
            fare: 12186,
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
            adjustments: null,
          },
          {
            fare: 14014,
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
            adjustments: null,
          },
          {
            fare: 19498,
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
            adjustments: null,
          },
        ],
        number: "0062698215637",
        record_locator: "CU9GEF",
        passenger: "John Smith",
      },
    ],
    itinerary_locator: "1122337694093",
    invoice_level_adjustments: null,
  },
};

describe("aggregateTaxes", () => {
  it("should work", () => {
    let result = aggregateTaxes(testData as any); // TODO
    expect(result[0].name).toBe("US Transportation Tax");
    expect(result[0].amount).toBe(23229);
    expect(result[3].name).toBe("US Flight Segment Tax");
    expect(result[3].amount).toBe(3200);
  });
});

describe("aggregateTicketFares", () => {
  const organizedTickets = organizeFlightTickets(testData.flight as any); // TODO
  // This is sort of just a reducer but that's fine
  it("should work", () => {
    let result = aggregateTicketFares(organizedTickets[0]);
    expect(result).toBe(60931);
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
    let reorganizedRoutes = organizeTransitRoutes(
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
    expect(reorganizedRoutes[0].passengers[0].passenger).toBe("Honora Doe");
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

    expect(reorganizedRoutes[0].passengers[1].passenger).toBe("Ted Doe");
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

    expect(reorganizedRoutes[0].passengers[2].passenger).toBe("Rita Doe");
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
    const receipt = receipts.flight as unknown as lts.v1_5_1.Receipt;

    let ticket = receipt?.itemization?.flight?.tickets[0];
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
