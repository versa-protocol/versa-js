import { createReceiptDoc } from "./index";
import { Receipt, Org } from "@versa/schema";
import { jsPDF } from "jspdf";

// Mock jsPDF
jest.mock("jspdf");
jest.mock("jspdf-autotable");
jest.mock("svg2pdf.js");

// Mock all PDF generation modules to avoid execution
jest.mock("./pdfHeader", () => ({
  Header: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("./pdfParties", () => ({
  Parties: jest.fn().mockReturnValue({ y: 3, page: 1 }),
}));
jest.mock("./pdfTypeSubHeader", () => ({
  TypeSubHeader: jest.fn().mockReturnValue({ y: 4, page: 1 }),
}));
jest.mock("./pdfItems", () => ({
  Items: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("./pdfTotals", () => ({
  Totals: jest.fn().mockReturnValue(undefined),
}));
jest.mock("./pdfPayments", () => ({
  Payments: jest.fn().mockReturnValue(undefined),
}));
jest.mock("./pdfFooters", () => ({
  Footers: jest.fn().mockReturnValue(undefined),
}));
jest.mock("./pdfSupplementalText", () => ({
  SupplementalText: jest.fn().mockReturnValue(undefined),
}));

// Mock 1.11.0 version
jest.mock("./1.11.0", () => ({
  createReceiptDoc_v1_11_0: jest.fn().mockResolvedValue({
    setLineWidth: jest.fn(),
    save: jest.fn(() => new Blob()),
    output: jest.fn(() => ""),
  }),
}));

describe("PDF Receipt Generation - 2.0 Schema", () => {
  let mockDoc: jest.Mocked<jsPDF>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock jsPDF instance
    mockDoc = {
      setLineWidth: jest.fn(),
      setLineHeightFactor: jest.fn(),
      internal: {
        pageSize: {
          getWidth: jest.fn(() => 8.5),
          getHeight: jest.fn(() => 11),
        },
      },
      setPage: jest.fn(),
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      text: jest.fn(),
      setDrawColor: jest.fn(),
      rect: jest.fn(),
      getCurrentPageInfo: jest.fn(() => ({ pageNumber: 1 })),
      addPage: jest.fn(),
      svg: jest.fn().mockResolvedValue(undefined),
      line: jest.fn(),
      setTextColor: jest.fn(),
      setFillColor: jest.fn(),
      roundedRect: jest.fn(),
      getTextWidth: jest.fn(() => 2),
      circle: jest.fn(),
      save: jest.fn(() => new Blob()),
      output: jest.fn(() => ""),
    } as unknown as jest.Mocked<jsPDF>;

    // Mock jsPDF constructor
    (jsPDF as unknown as jest.Mock).mockImplementation(() => mockDoc);
  });

  it("should create a PDF with flight data and Person passenger (v2.0.0)", async () => {
    const testMerchant: Org = {
      name: "Delta Airlines",
      brand_color: "#003366",
      website: "https://delta.com",
      logo: "https://delta.com/logo.png",
    };

    const testReceipt: Receipt = {
      schema_version: "2.0.0",
      header: {
        invoice_number: "TEST-123",
        currency: "usd",
        total: 140220,
        subtotal: 121862,
        paid: 140220,
        invoiced_at: 1713295619,
        customer: {
          name: "John Doe",
          email: "john@example.com",
          metadata: [],
        },
      },
      itemization: {
        flight: {
          tickets: [
            {
              segments: [
                {
                  fare: 15233,
                  departure_airport_code: "LAX",
                  arrival_airport_code: "JFK",
                  aircraft_type: "B738",
                  departure_at: 1713196492,
                  arrival_at: 1713197752,
                  departure_tz: "America/Los_Angeles",
                  arrival_tz: "America/New_York",
                  flight_number: "DL100",
                  class_of_service: "Y",
                  seat: "15A",
                  taxes: [
                    {
                      amount: 1142,
                      rate: 0.075,
                      name: "US Transportation Tax",
                    },
                  ],
                  adjustments: [],
                  metadata: [],
                },
              ],
              fare: 15233,
              number: "0012345678901",
              record_locator: "ABC123",
              passenger: {
                first_name: "John",
                last_name: "Doe",
                metadata: [],
              },
              taxes: [],
            },
          ],
          itinerary_locator: "ABC123",
          invoice_level_adjustments: [],
        },
      },
      payments: [
        {
          amount: 140220,
          paid_at: 1713295619,
          payment_type: "card",
          card_payment: {
            last_four: "1234",
            network: "visa",
          },
        },
      ],
      footer: {
        actions: [
          {
            name: "View Receipt",
            url: "https://delta.com/receipt/TEST-123",
          },
        ],
        supplemental_text: "Thank you for flying with Delta!",
      },
    };

    const doc = await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#003366",
    });

    // Verify PDF was created
    expect(jsPDF).toHaveBeenCalledWith({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });

    // Verify document setup
    expect(mockDoc.setLineWidth).toHaveBeenCalledWith((1 / 72) * 0.75);

    // Verify the document is returned
    expect(doc).toBe(mockDoc);
  });

  it("should handle lodging receipts", async () => {
    const testMerchant: Org = {
      name: "Grand Hotel",
      brand_color: "#8B4513",
    };

    const testReceipt: Receipt = {
      schema_version: "2.0.0",
      header: {
        currency: "usd",
        total: 50000,
        subtotal: 45000,
        paid: 50000,
        invoiced_at: 1713295619,
      },
      itemization: {
        lodging: {
          check_in: 1713196492,
          check_out: 1713368292,
          location: {
            name: "Grand Hotel Downtown",
            address: {
              street_address: "123 Main St",
              city: "New York",
              region: "NY",
              postal_code: "10001",
              country: "US",
            },
          },
          items: [
            {
              description: "Room Rate - 2 nights",
              amount: 40000,
              taxes: [],
            },
            {
              description: "Resort Fee",
              amount: 5000,
              taxes: [],
            },
          ],
          invoice_level_adjustments: [],
        },
      },
      payments: [
        {
          amount: 50000,
          paid_at: 1713295619,
          payment_type: "card",
          card_payment: {
            last_four: "5678",
            network: "mastercard",
          },
        },
      ],
      footer: {
        actions: [],
      },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#8B4513",
    });

    // Verify PDF was created
    expect(jsPDF).toHaveBeenCalled();
  });

  it("should handle general itemization receipts", async () => {
    const testMerchant: Org = {
      name: "Test Store",
      website: "https://teststore.com",
    };

    const testReceipt: Receipt = {
      schema_version: "2.0.0",
      header: {
        currency: "usd",
        total: 10850,
        subtotal: 10000,
        paid: 10850,
        invoiced_at: 1713295619,
      },
      itemization: {
        general: {
          items: [
            {
              description: "Widget A",
              amount: 5000,
              quantity: 2,
              unit_cost: 2500,
              taxes: [
                {
                  amount: 425,
                  rate: 0.085,
                  name: "Sales Tax",
                },
              ],
            },
            {
              description: "Widget B",
              amount: 5000,
              quantity: 1,
              unit_cost: 5000,
              taxes: [
                {
                  amount: 425,
                  rate: 0.085,
                  name: "Sales Tax",
                },
              ],
            },
          ],
          invoice_level_adjustments: [],
        },
      },
      payments: [
        {
          amount: 10850,
          paid_at: 1713295619,
          payment_type: "ach",
          ach_payment: {
            routing_number: "123456789",
          },
        },
      ],
      footer: {
        actions: [],
        supplemental_text: "Thank you for your purchase!",
      },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#0000FF",
    });

    // Verify PDF was created
    expect(jsPDF).toHaveBeenCalled();
  });

  it("should skip supplemental text when not provided", async () => {
    const testMerchant: Org = {
      name: "Test Merchant",
    };

    const testReceipt: Receipt = {
      schema_version: "2.0.0",
      header: {
        currency: "usd",
        total: 1000,
        subtotal: 1000,
        paid: 1000,
        invoiced_at: 1713295619,
      },
      itemization: {
        general: {
          items: [
            {
              description: "Test Item",
              amount: 1000,
            },
          ],
          invoice_level_adjustments: [],
        },
      },
      payments: [],
      footer: {
        actions: [],
        // No supplemental_text
      },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#000000",
    });

    // Test passes if no error is thrown
    expect(jsPDF).toHaveBeenCalled();
  });

  it("should handle multiple payments", async () => {
    const testMerchant: Org = {
      name: "Test Merchant",
    };

    const testReceipt: Receipt = {
      schema_version: "2.0.0",
      header: {
        currency: "usd",
        total: 10000,
        subtotal: 10000,
        paid: 10000,
        invoiced_at: 1713295619,
      },
      itemization: {
        general: {
          items: [
            {
              description: "Test Item",
              amount: 10000,
            },
          ],
          invoice_level_adjustments: [],
        },
      },
      payments: [
        {
          amount: 5000,
          paid_at: 1713295619,
          payment_type: "card",
          card_payment: {
            last_four: "1111",
            network: "visa",
          },
        },
        {
          amount: 5000,
          paid_at: 1713295619,
          payment_type: "card",
          card_payment: {
            last_four: "2222",
            network: "mastercard",
          },
        },
      ],
      footer: {
        actions: [],
      },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#FF0000",
    });

    // Verify PDF was created
    expect(jsPDF).toHaveBeenCalled();
  });
});

describe("PDF Receipt Generation - Version Branching", () => {
  let mockDoc: jest.Mocked<jsPDF>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock jsPDF instance
    mockDoc = {
      setLineWidth: jest.fn(),
      save: jest.fn(() => new Blob()),
      output: jest.fn(() => ""),
    } as unknown as jest.Mocked<jsPDF>;

    // Mock jsPDF constructor
    (jsPDF as unknown as jest.Mock).mockImplementation(() => mockDoc);
  });

  it("should handle v1.11.0 schema with string passenger", async () => {
    const testMerchant: Org = {
      name: "United Airlines",
      brand_color: "#002F5D",
      website: "https://united.com",
    };

    const testReceipt: Receipt = {
      schema_version: "1.11.0",
      header: {
        invoice_number: "UA-789",
        currency: "usd",
        total: 32500,
        subtotal: 30000,
        paid: 32500,
        invoiced_at: 1713295619,
        customer: {
          name: "Jane Smith",
          email: "jane@example.com",
          metadata: [],
        },
      },
      itemization: {
        flight: {
          tickets: [
            {
              segments: [
                {
                  fare: 30000,
                  departure_airport_code: "SFO",
                  arrival_airport_code: "ORD",
                  aircraft_type: "B737",
                  departure_at: 1713196492,
                  arrival_at: 1713207292,
                  departure_tz: "America/Los_Angeles",
                  arrival_tz: "America/Chicago",
                  flight_number: "UA123",
                  class_of_service: "E",
                  seat: "23B",
                  taxes: [
                    {
                      amount: 2500,
                      rate: 0.083,
                      name: "Federal Excise Tax",
                    },
                  ],
                  adjustments: [],
                  metadata: [],
                },
              ],
              fare: 30000,
              number: "0987654321012",
              record_locator: "XYZ789",
              passenger: "Jane Smith" as any, // String passenger for v1.11.0
              taxes: [],
            },
          ],
          itinerary_locator: "XYZ789",
          invoice_level_adjustments: [],
        },
      },
      payments: [
        {
          amount: 32500,
          paid_at: 1713295619,
          payment_type: "card",
          card_payment: {
            last_four: "9876",
            network: "amex",
          },
        },
      ],
      footer: {
        actions: [],
      },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#002F5D",
    });

    // Verify the v1.11.0 handler was called
    const { createReceiptDoc_v1_11_0 } = require("./1.11.0");
    expect(createReceiptDoc_v1_11_0).toHaveBeenCalled();
  });

  it("should handle v1.10.0 schema (routed to v1.11.0)", async () => {
    const testMerchant: Org = {
      name: "Southwest Airlines",
      brand_color: "#304CB2",
    };

    const testReceipt: Receipt = {
      schema_version: "1.10.0",
      header: {
        currency: "usd",
        total: 15000,
        subtotal: 15000,
        paid: 15000,
        invoiced_at: 1713295619,
      },
      itemization: {
        flight: {
          tickets: [
            {
              segments: [
                {
                  fare: 15000,
                  departure_airport_code: "DAL",
                  arrival_airport_code: "HOU",
                  departure_at: 1713196492,
                  arrival_at: 1713200092,
                  flight_number: "SW456",
                  taxes: [],
                  adjustments: [],
                  metadata: [],
                },
              ],
              fare: 15000,
              passenger: "John Doe" as any,
              taxes: [],
            },
          ],
          invoice_level_adjustments: [],
        },
      },
      payments: [],
      footer: {
        actions: [],
      },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#304CB2",
    });

    // Verify the v1.11.0 handler was called
    const { createReceiptDoc_v1_11_0 } = require("./1.11.0");
    expect(createReceiptDoc_v1_11_0).toHaveBeenCalled();
  });

  it("should warn about retired schema versions", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const testMerchant: Org = {
      name: "Old Airlines",
    };

    const testReceipt: Receipt = {
      schema_version: "1.5.0", // Older than oldest LTS
      header: {
        currency: "usd",
        total: 10000,
        subtotal: 10000,
        paid: 10000,
        invoiced_at: 1713295619,
      },
      itemization: {
        general: {
          items: [{ description: "Flight", amount: 10000 }],
          invoice_level_adjustments: [],
        },
      },
      payments: [],
      footer: { actions: [] },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#000000",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "WARN: Received schema version that has been retired"
      )
    );

    consoleSpy.mockRestore();
  });

  it("should warn about newer schema versions", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const testMerchant: Org = {
      name: "Future Airlines",
    };

    const testReceipt: Receipt = {
      schema_version: "3.0.0", // Newer than latest
      header: {
        currency: "usd",
        total: 20000,
        subtotal: 20000,
        paid: 20000,
        invoiced_at: 1713295619,
      },
      itemization: {
        general: {
          items: [{ description: "Flight", amount: 20000 }],
          invoice_level_adjustments: [],
        },
      },
      payments: [],
      footer: { actions: [] },
    };

    await createReceiptDoc({
      merchant: testMerchant,
      receipt: testReceipt,
      brandColor: "#FF00FF",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "WARN: Received schema version that is newer than the latest supported version"
      )
    );

    consoleSpy.mockRestore();
  });
});
