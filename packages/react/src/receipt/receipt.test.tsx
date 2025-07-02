import { render } from "@testing-library/react";
import { ReceiptDisplay } from "./receipt";
import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";

import { receipts, senders } from "@versa/examples";

describe("Receipt UI", () => {
  it("should render the flight segment tax", () => {
    const { getByText } = render(
      <ReceiptDisplay merchant={senders.bend} receipt={receipts.flight} />
    );
    expect(getByText("US Flight Segment Tax")).toBeInTheDocument();
    expect(getByText("$32.00")).toBeInTheDocument();
  });
  it("does not produce weird number on a re-render", () => {
    render(
      <ReceiptDisplay merchant={senders.bend} receipt={receipts.flight} />
    );
    // Rendering the component twice in a row previously caused the values to mutate
    const { getAllByText } = render(
      <ReceiptDisplay merchant={senders.bend} receipt={receipts.flight} />
    );
    expect(getAllByText("US Flight Segment Tax")).toHaveLength(2);
    expect(getAllByText("$32.00")).toHaveLength(2);
  });
});
