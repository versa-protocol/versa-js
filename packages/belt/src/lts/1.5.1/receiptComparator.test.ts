import { lts } from "@versaprotocol/schema";
import { compare, compareSeries } from "./receiptComparator";

describe("receiptComparator", () => {
  const latestReceipt: lts.v1_5_1.Receipt = {
    itemization: {
      general: null,
      lodging: null,
      car_rental: null,
      transit_route: null,
      subscription: null,
      flight: null,
      ecommerce: {
        invoice_level_adjustments: [],
        invoice_level_line_items: [],
        shipments: [
          {
            items: [
              {
                quantity: 1,
                description: "",
                subtotal: 0,
              },
            ],
            tracking_number: null,
            expected_delivery_at: null,
            shipment_status: null,
            destination_address: null,
          },
        ],
      },
    },
    schema_version: "1.2.0",
    header: {
      invoice_number: "",
      currency: "usd",
      total: 0,
      subtotal: 0,
      paid: 0,
      invoiced_at: 0,
      mcc: null,
      third_party: null,
      customer: null,
      location: null,
    },
    actions: [],
    payments: [],
  };

  const previousReceiptWithShipment: lts.v1_5_1.Receipt = {
    itemization: {
      general: null,
      lodging: null,
      car_rental: null,
      transit_route: null,
      subscription: null,
      flight: null,
      ecommerce: {
        invoice_level_adjustments: [],
        invoice_level_line_items: [],
        shipments: [
          {
            items: [
              {
                quantity: 1,
                description: "",
                subtotal: 0,
              },
            ],
            tracking_number: null,
            expected_delivery_at: null,
            shipment_status: null,
            destination_address: null,
          },
        ],
      },
    },
    schema_version: "1.2.0",
    header: {
      invoice_number: "",
      currency: "usd",
      total: 0,
      subtotal: 0,
      paid: 0,
      invoiced_at: 0,
      mcc: null,
      third_party: null,
      customer: null,
      location: null,
    },
    actions: [],
    payments: [],
  };

  const previousReceiptWithoutShipment: lts.v1_5_1.Receipt = {
    itemization: {
      general: null,
      lodging: null,
      car_rental: null,
      transit_route: null,
      subscription: null,
      flight: null,
      ecommerce: {
        invoice_level_adjustments: [],
        invoice_level_line_items: [],
        shipments: [],
      },
    },
    schema_version: "1.2.0",
    header: {
      invoice_number: "",
      currency: "usd",
      total: 0,
      subtotal: 0,
      paid: 0,
      invoiced_at: 0,
      mcc: null,
      third_party: null,
      customer: null,
      location: null,
    },
    actions: [],
    payments: [],
  };
  describe("compare function", () => {
    it("should not return a shipment event for identical receipts", () => {
      expect(
        compare(
          { receipt: latestReceipt, protocolTimestamp: 100 },
          { receipt: previousReceiptWithShipment, protocolTimestamp: 50 }
        )
      ).toStrictEqual({
        events: [],
      });
    });

    it("should return a shipment event for a new shipment", () => {
      expect(
        compare(
          { receipt: latestReceipt, protocolTimestamp: 100 },
          { receipt: previousReceiptWithoutShipment, protocolTimestamp: 50 }
        )
      ).toStrictEqual({
        events: [
          {
            type: "Shipped",
            description: "New shipment created",
            activity_at: 100,
          },
        ],
      });
    });
  });

  describe("compareSeries function", () => {
    it("should return an empty diff for an empty series", () => {
      expect(compareSeries([])).toStrictEqual({
        events: [],
      });
    });

    it("should return an empty diff for a series with one receipt", () => {
      const receipt = { receipt: latestReceipt, protocolTimestamp: 100 };
      expect(compareSeries([receipt])).toStrictEqual({
        events: [],
      });
    });

    it("should return diff for a series with two receipts", () => {
      const receipt = { receipt: latestReceipt, protocolTimestamp: 100 };
      const previous = {
        receipt: previousReceiptWithoutShipment,
        protocolTimestamp: 50,
      };
      expect(compareSeries([receipt, previous])).toStrictEqual({
        events: [
          {
            type: "Shipped",
            description: "New shipment created",
            activity_at: 100,
          },
        ],
      });
    });
  });
});
