import { render, screen } from "@testing-library/react";
import { ReceiptDisplay } from "./receipt";
import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";

import { senders } from "@versa/examples";
import { receipts } from "@versa/examples";
const carRentalReceipt = receipts.car_rental;

describe("Receipt UI - Car Rental 2.1.1", () => {
  beforeEach(() => {
    // Ensure we're testing the 2.0 schema version
    expect(carRentalReceipt.schema_version).toBe("2.1.1");
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
  it("should render the driver name", () => {
    render(
      <ReceiptDisplay merchant={senders.bend} receipt={carRentalReceipt} />
    );

    expect(screen.getAllByText(/Henry Ford/)).toHaveLength(1);
  });
});
