import { organizeFlightTickets } from "./receiptHelpers";

describe("passenger metadata handling", () => {
  it("should handle v1.11.0 string passengers without metadata", () => {
    const flight = {
      tickets: [
        {
          segments: [
            {
              departure_airport_code: "LAX",
              arrival_airport_code: "JFK",
              fare: 25000,
              taxes: [],
              adjustments: [],
              metadata: [],
            },
          ],
          passenger: "John Doe", // v1.11.0 string passenger
          record_locator: "ABC123",
          fare: 25000,
          taxes: [],
        },
      ],
      invoice_level_adjustments: [],
    };

    const organized = organizeFlightTickets(flight as any);

    expect(organized).toHaveLength(1);
    expect(organized[0].passengers[0].passenger).toBe("John Doe");
    expect(organized[0].passengers[0].passenger_metadata).toEqual([]);
  });

  it("should handle v2.0.0-rc1 Person passengers with metadata", () => {
    const flight = {
      tickets: [
        {
          segments: [
            {
              departure_airport_code: "LAX",
              arrival_airport_code: "JFK",
              fare: 25000,
              taxes: [],
              adjustments: [],
              metadata: [],
            },
          ],
          passenger: {
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            metadata: [
              { key: "seat_preference", value: "aisle" },
              { key: "meal_preference", value: "vegetarian" },
            ],
          },
          record_locator: "ABC123",
          fare: 25000,
          taxes: [],
        },
      ],
      invoice_level_adjustments: [],
    };

    const organized = organizeFlightTickets(flight as any);

    expect(organized).toHaveLength(1);
    expect(organized[0].passengers[0].passenger).toEqual({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      metadata: [
        { key: "seat_preference", value: "aisle" },
        { key: "meal_preference", value: "vegetarian" },
      ],
    });
    expect(organized[0].passengers[0].passenger_metadata).toEqual([
      { key: "seat_preference", value: "aisle" },
      { key: "meal_preference", value: "vegetarian" },
    ]);
  });

  it("should handle multiple passengers with different metadata", () => {
    const flight = {
      tickets: [
        {
          segments: [
            {
              departure_airport_code: "LAX",
              arrival_airport_code: "JFK",
              fare: 25000,
              taxes: [],
              adjustments: [],
              metadata: [],
            },
          ],
          passenger: {
            first_name: "John",
            last_name: "Doe",
            metadata: [{ key: "seat", value: "12A" }],
          },
          record_locator: "ABC123",
          fare: 25000,
          taxes: [],
        },
        {
          segments: [
            {
              departure_airport_code: "LAX",
              arrival_airport_code: "JFK",
              fare: 25000,
              taxes: [],
              adjustments: [],
              metadata: [],
            },
          ],
          passenger: {
            first_name: "Jane",
            last_name: "Smith",
            metadata: [
              { key: "seat", value: "12B" },
              { key: "special_assistance", value: "wheelchair" },
            ],
          },
          record_locator: "ABC123",
          fare: 25000,
          taxes: [],
        },
      ],
      invoice_level_adjustments: [],
    };

    const organized = organizeFlightTickets(flight as any);

    expect(organized).toHaveLength(1);
    expect(organized[0].passengers).toHaveLength(2);

    // First passenger metadata
    expect(organized[0].passengers[0].passenger_metadata).toEqual([
      { key: "seat", value: "12A" },
    ]);

    // Second passenger metadata
    expect(organized[0].passengers[1].passenger_metadata).toEqual([
      { key: "seat", value: "12B" },
      { key: "special_assistance", value: "wheelchair" },
    ]);
  });
});
