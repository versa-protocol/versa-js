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

  it("should render payment method for single payment matching total", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called with payment method
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        body: expect.arrayContaining([
          ["Payment Method:", expect.stringContaining("1234")],
        ]),
      })
    );
  });

  it("should render Visa card payment with correct format", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable includes formatted Visa payment
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow).toBeDefined();
    expect(paymentRow![1]).toBe("Visa ··· 1234");
  });

  it("should render Mastercard payment with correct format", async () => {
    testReceipt.payments[0].card_payment!.network = "mastercard";
    testReceipt.payments[0].card_payment!.last_four = "5678";

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable includes formatted Mastercard payment
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow).toBeDefined();
    expect(paymentRow![1]).toBe("Mastercard ··· 5678");
  });

  it("should not render payment method for multiple payments", async () => {
    // Add second payment
    testReceipt.payments.push({
      amount: 5000,
      paid_at: 1705939200,
      payment_type: "card",
      card_payment: {
        last_four: "9999",
        network: "amex",
      },
    });

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that payment method is not included
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow).toBeUndefined();
  });

  it("should not render payment method when payment doesn't match total", async () => {
    testReceipt.payments[0].amount = 5000; // Less than total

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that payment method is not included
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow).toBeUndefined();
  });

  it("should handle ACH payment type", async () => {
    testReceipt.payments[0] = {
      amount: 10000,
      paid_at: 1705939200,
      payment_type: "ach",
      ach_payment: {
        routing_number: "123456789",
      },
    };

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // ACH payments should not show payment method (as per the paymentMethod function)
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow![1]).toBe("");
  });

  it("should handle payment without card details", async () => {
    testReceipt.payments[0].card_payment = null;

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Should not crash and payment method should be empty
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow![1]).toBe("");
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
    expect(bodyData[3][0]).toBe("Payment Method:");
  });

  it("should set correct table styling", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that autoTable was called with correct styling
    expect(mockAutoTable).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        theme: "plain",
        styles: expect.objectContaining({
          fontSize: 10,
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
          bottom: 2 * margin,
          left: margin,
        },
      })
    );
  });

  it("should handle card payment without network", async () => {
    testReceipt.payments[0].card_payment!.network = null;

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Should still show last four digits
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow![1]).toBe("··· 1234");
  });

  it("should handle card payment without last four digits", async () => {
    testReceipt.payments[0].card_payment!.last_four = "";

    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Should show network but no last four
    const autoTableCall = mockAutoTable.mock.calls[0];
    const bodyData = autoTableCall[1].body as string[][];
    const paymentRow = bodyData.find((row) => row[0] === "Payment Method:");

    expect(paymentRow![1]).toBe("Visa ");
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

  it("should render title 'Receipt'", async () => {
    await Header(mockDoc, testMerchant, testReceipt, 0.375, "#FF0000");

    // Check that "Receipt" title was rendered
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Receipt",
      expect.any(Number),
      expect.any(Number)
    );
  });
});
