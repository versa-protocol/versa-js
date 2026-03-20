import { Header } from "./pdfHeader";
import { Receipt, Org } from "@versa/schema";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Mock dependencies
jest.mock("jspdf");
jest.mock("jspdf-autotable");
jest.mock("svg2pdf.js");
jest.mock("./encodeImage", () => ({
  encode: jest.fn().mockResolvedValue("data:image/png;base64,mockImageData"),
}));

describe("PDF Header - Invoice Details Rendering", () => {
  let mockDoc: jest.Mocked<jsPDF>;
  let mockAutoTable: jest.MockedFunction<typeof autoTable>;
  let testMerchant: Org;
  let testReceipt: Receipt;

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
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      text: jest.fn(),
      getTextWidth: jest.fn(() => 2),
      setTextColor: jest.fn(),
      setFillColor: jest.fn(),
      setDrawColor: jest.fn(),
      rect: jest.fn(),
      roundedRect: jest.fn(),
      addImage: jest.fn(),
    } as unknown as jest.Mocked<jsPDF>;

    mockAutoTable = autoTable as jest.MockedFunction<typeof autoTable>;

    // Setup test data
    testMerchant = {
      name: "Test Merchant",
      brand_color: "#FF0000",
      website: "https://testmerchant.com",
      logo: "https://testmerchant.com/logo.png",
    };

    testReceipt = {
      schema_version: "2.0.0",
      header: {
        invoice_number: "INV-2024-001",
        currency: "usd",
        total: 10000,
        subtotal: 9000,
        paid: 10000,
        invoiced_at: 1705939200, // 2024-01-22 16:00:00 UTC
      },
      itemization: {
        general: {
          items: [
            {
              description: "Test Item",
              amount: 9000,
            },
          ],
          invoice_level_adjustments: [],
        },
      },
      payments: [
        {
          amount: 10000,
          paid_at: 1705939200,
          payment_type: "card",
          card_payment: {
            last_four: "1234",
            network: "visa",
          },
        },
      ],
      footer: {
        actions: [],
      },
    };
  });

  it("should render invoice date in the header table", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called with invoice date
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        body: expect.arrayContaining([["Invoice Date:", "Jan 22, 2024"]]),
      })
    );
  });

  it("should render invoice number when provided", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called with invoice number
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        body: expect.arrayContaining([["Invoice Number:", "INV-2024-001"]]),
      })
    );
  });

  it("should not render invoice number when not provided", async () => {
    testReceipt.header.invoice_number = undefined;

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called without invoice number
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const invoiceNumberRow = bodyData.find(
      (row) => row[0] === "Invoice Number:"
    );

    expect(invoiceNumberRow).toBeUndefined();
  });

  it("should not render payment method in header", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow).toBeUndefined();
  });

  it("should format dates correctly for different timestamps", async () => {
    // Test with a different date
    testReceipt.header.invoiced_at = 1735689600; // 2025-01-01 00:00:00 UTC

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called with correctly formatted date
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        body: expect.arrayContaining([["Invoice Date:", "Dec 31, 2024"]]),
      })
    );
  });

  it("should render all header fields in correct order", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check the order of fields
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];

    expect(bodyData[0][0]).toBe("Invoice Date:");
    expect(bodyData[1][0]).toBe("Invoice Number:");
    expect(bodyData[2][0]).toBe("Date Paid:");
  });

  it("should set correct table styling", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called with correct styling
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        theme: "plain",
        styles: expect.objectContaining({
          fontSize: 9,
          cellPadding: expect.objectContaining({
            top: 0,
            right: 0.125,
            bottom: 0.0625,
            left: 0,
          }),
        }),
      })
    );
  });

  it("should position table correctly with margins", async () => {
    const margin = 0.375;
    await Header(mockDoc, testMerchant, testReceipt, margin, "#FF0000");

    // Check that autoTable was called with correct positioning
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        startY: margin + 20 / 72 + margin,
        margin: {
          top: margin,
          right: margin,
          bottom: margin,
          left: margin,
        },
      })
    );
  });

  it("should handle card payment without last four digits", async () => {
    testReceipt.payments[0].card_payment!.last_four = "";

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];

    expect(bodyData).toBeDefined();
  });

  it("should render merchant logo when provided", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that addImage was called for the logo
    expect(mockDoc.addImage).toHaveBeenCalledWith(
      "data:image/png;base64,mockImageData",
      "JPEG",
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should render title 'Receipt' for general receipt", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that "Receipt" title was rendered
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Receipt",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should render title 'Flight Receipt' when itemization has flight", async () => {
    testReceipt.itemization = {
      ...testReceipt.itemization,
      flight: {
        tickets: [
          {
            segments: [
              {
                departure_airport_code: "JFK",
                arrival_airport_code: "LAX",
              },
            ],
          },
        ],
      },
    };

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Flight Receipt",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should render title 'Lodging Receipt' when itemization has lodging", async () => {
    testReceipt.itemization = {
      ...testReceipt.itemization,
      lodging: {
        check_in: 1705939200,
        check_out: 1706025600,
        location: { name: "Test Hotel" },
        items: [{ description: "Room", amount: 10000 }],
      },
    };

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Lodging Receipt",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should render title 'Car Rental Receipt' when itemization has car_rental", async () => {
    testReceipt.itemization = {
      ...testReceipt.itemization,
      car_rental: {
        rental_at: 1705939200,
        return_at: 1706025600,
        rental_location: { name: "Rental Co" },
        return_location: { name: "Rental Co" },
        odometer_reading_in: 1000,
        odometer_reading_out: 1100,
        items: [{ description: "Rental", amount: 10000 }],
      },
    };

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Car Rental Receipt",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should render title 'Flight Invoice' when paid is 0 and no payments", async () => {
    testReceipt.header.paid = 0;
    testReceipt.payments = [];
    testReceipt.itemization = {
      ...testReceipt.itemization,
      flight: {
        tickets: [
          {
            segments: [
              {
                departure_airport_code: "JFK",
                arrival_airport_code: "LAX",
              },
            ],
          },
        ],
      },
    };

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Flight Invoice",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should render title 'Invoice' when paid is 0 and payments is empty", async () => {
    testReceipt.header.paid = 0;
    testReceipt.payments = [];

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Invoice",
      expect.any(Number),
      expect.any(Number)
    );
  });
});
