import { render, screen } from "@testing-library/react";
import { ReceiptDisplay } from "./receipt";
import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";

import { senders } from "@versa/examples";
const carRentalReceiptJson = `{
  "schema_version": "2.1.0",
  "header": {
    "invoice_number": "auth_1MzFN1K8F4fqH0lBmFq8CjbU",
    "currency": "usd",
    "total": 43769,
    "subtotal": 31332,
    "paid": 43769,
    "invoiced_at": 1713295619,
    "mcc": null,
    "third_party": null,
    "customer": null,
    "location": {
      "name": null,
      "address": {
        "tz": "America/New_York"
      },
      "phone": null,
      "url": null,
      "google_place_id": null,
      "image": null
    },
    "invoice_asset_id": null,
    "receipt_asset_id": null
  },
  "itemization": {
    "general": null,
    "lodging": null,
    "ecommerce": null,
    "car_rental": {
      "rental_at": 1713196492,
      "return_at": 1713415500,
      "rental_location": {
        "google_place_id": null,
        "name": "Portland Int. Airport (PDX)",
        "url": null,
        "address": {
          "street_address": "7240 Northeast Airport Way",
          "city": "Portland",
          "region": "OR",
          "country": "US",
          "postal_code": "97220",
          "lat": 45.588025310489726,
          "lon": -122.59212461576227,
          "tz": null
        },
        "phone": "+15035287900",
        "image": null
      },
      "return_location": {
        "google_place_id": null,
        "name": "Portland Int. Airport (PDX)",
        "url": null,
        "address": {
          "street_address": "7240 Northeast Airport Way",
          "city": "Portland",
          "region": "OR",
          "country": "US",
          "postal_code": "97220",
          "lat": 45.588025310489726,
          "lon": -122.59212461576227,
          "tz": null
        },
        "phone": "+15035287900",
        "image": null
      },
      "vehicle": {
        "description": "Polestar 2",
        "image": "https://versa.org/temp_demo_assets/hertz/polestar2.png"
      },
      "driver_name": "Henry Ford",
      "odometer_reading_in": 100,
      "odometer_reading_out": 210,
      "metadata": [],
      "invoice_level_adjustments": [],
      "items": [
        {
          "quantity": 3,
          "description": "Daily rate",
          "unit_cost": 9045,
          "unit": "day",
          "amount": 27135,
          "taxes": [
            {
              "name": "Sales Tax",
              "amount": 6676,
              "rate": 0.18
            },
            {
              "name": "Rental Car Concession Fee",
              "amount": 3481,
              "rate": null
            },
            {
              "name": "Vehicle License Cost Recover",
              "amount": 480,
              "rate": null
            },
            {
              "name": "Customer Fac",
              "amount": 1800,
              "rate": null
            }
          ],
          "adjustments": []
        },
        {
          "quantity": 3,
          "description": "Child seat daily rate",
          "unit_cost": 1399,
          "unit": "day",
          "amount": 4197,
          "adjustments": []
        }
      ]
    },
    "transit_route": null,
    "subscription": null,
    "flight": null
  },
  "footer": {
    "actions": []
  },
  "payments": [
    {
      "paid_at": 1713295619,
      "payment_type": "card",
      "amount": 43769,
      "card_payment": {
        "last_four": "7806",
        "network": "mastercard"
      },
      "ach_payment": null
    }
  ]
}`;

describe("Receipt UI - Car Rental 2.1.0", () => {
  const carRentalReceipt = JSON.parse(carRentalReceiptJson);
  beforeEach(() => {
    // Ensure we're testing the 2.0 schema version
    expect(carRentalReceipt.schema_version).toBe("2.1.0");
  });
  it("should display total amount", () => {
    render(
      <ReceiptDisplay merchant={senders.bend} receipt={carRentalReceipt} />
    );
    // Total should be $1,400.40 - look for the formatted amount
    expect(screen.getAllByText(/\$437\.69/)).toHaveLength(2); // Appears in header and totals
  });
  it("should render the vehicle description", () => {
    render(
      <ReceiptDisplay merchant={senders.bend} receipt={carRentalReceipt} />
    );

    expect(screen.getAllByText(/Polestar 2/)).toHaveLength(1);
  });

  it("should render the standard car rental component for other versions", () => {
    const { queryByTestId } = render(
      // @ts-ignore
      <ReceiptDisplay merchant={senders.bend} receipt={carRentalReceipt} />
    );
    expect(queryByTestId("car-rental-2.1.0")).not.toBeInTheDocument();
  });

  it("should render the driver name", () => {
    render(
      <ReceiptDisplay merchant={senders.bend} receipt={carRentalReceipt} />
    );

    expect(screen.getAllByText(/Henry Ford/)).toHaveLength(1);
  });
});
