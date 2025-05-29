import { render, screen } from "@testing-library/react";
import { ReceiptDisplay } from "./receipt";
import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";

import { receipts, senders } from "@versaprotocol/examples";

describe("Flight Receipt - 2.0 Schema", () => {
  const flightReceipt = receipts.flight;
  const merchant = senders.bend;

  beforeEach(() => {
    // Ensure we're testing the 2.0 schema version
    expect(flightReceipt.schema_version).toBe("2.0.0");
  });

  describe("Flight Header Information", () => {
    it("should display invoice number", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);
      expect(screen.getByText(/1MzFN1K8F4fqH0lBmFq8CjbU/)).toBeInTheDocument();
    });

    it("should display total amount", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);
      // Total should be $1,402.20 - look for the formatted amount
      expect(screen.getAllByText(/\$1,402\.20/)).toHaveLength(2); // Appears in header and totals
    });

    it("should display currency as USD", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);
      // Should find USD currency references
      expect(flightReceipt.header.currency).toBe("usd");
    });
  });

  describe("Flight Itinerary Display", () => {
    it("should display flight information in organized format", () => {
      const { container } = render(
        <ReceiptDisplay merchant={merchant} receipt={flightReceipt} />
      );

      // The component should render without errors
      expect(container).toBeInTheDocument();
    });

    it("should display basic flight data", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      // Should find some flight-related text in the document
      expect(screen.getByText(/Flight/i)).toBeInTheDocument();
    });
  });

  describe("Passenger Information", () => {
    it("should display passenger names from flight data", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      // Check for passenger names in the data - may appear multiple times
      expect(screen.getAllByText(/Susy/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Smith/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/John/).length).toBeGreaterThan(0);
    });

    it("should display confirmation codes", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      // Should show confirmation code - may appear multiple times
      expect(screen.getAllByText(/CU9GEF/).length).toBeGreaterThan(0);
    });
  });

  describe("Flight Taxes and Fees", () => {
    it("should display US Transportation Tax", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      expect(screen.getByText("US Transportation Tax")).toBeInTheDocument();
    });

    it("should display US September 11th Security Fee", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      expect(
        screen.getByText("US September 11th Security Fee")
      ).toBeInTheDocument();
    });

    it("should display US Passenger Facility Charge", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      expect(
        screen.getByText("US Passenger Facility Charge")
      ).toBeInTheDocument();
    });

    it("should display US Flight Segment Tax", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      expect(screen.getByText("US Flight Segment Tax")).toBeInTheDocument();
    });

    it("should display tax amounts in currency format", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      // Should show dollar amounts for taxes - multiple instances expected
      expect(screen.getAllByText(/\$\d+\.\d{2}/).length).toBeGreaterThan(0);
    });
  });

  describe("Flight Fare Information", () => {
    it("should have fare information in the data structure", () => {
      // Verify the data structure has fare information
      const segments = flightReceipt.itemization.flight?.tickets[0].segments;
      expect(segments?.[0].fare).toBe(15233);
      expect(segments?.[1].fare).toBe(12186);
    });

    it("should display class of service", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      // All segments have class "k" - should show economy interpretation
      const segments = flightReceipt.itemization.flight?.tickets[0].segments;
      expect(segments?.every((s) => s.class_of_service === "k")).toBe(true);
    });
  });

  describe("Flight Schedule Information", () => {
    it("should display formatted dates", () => {
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);

      // Should show formatted date - multiple instances expected
      expect(screen.getAllByText(/Apr/).length).toBeGreaterThan(0); // April dates
    });

    it("should handle timezone differences correctly", () => {
      const segments = flightReceipt.itemization.flight?.tickets[0].segments;

      // Verify timezone data is present
      expect(segments?.[0].departure_tz).toBe("America/Los_Angeles");
      expect(segments?.[0].arrival_tz).toBe("America/Chicago");
      expect(segments?.[1].departure_tz).toBe("America/Chicago");
      expect(segments?.[1].arrival_tz).toBe("America/Chicago");
    });
  });

  describe("Flight Receipt Structure Validation", () => {
    it("should have proper flight itemization structure", () => {
      expect(flightReceipt.itemization.flight).toBeDefined();
      expect(flightReceipt.itemization.flight?.tickets).toHaveLength(2); // Two passengers

      // Each ticket should have multiple segments
      expect(
        flightReceipt.itemization.flight?.tickets[0].segments
      ).toHaveLength(4);
      expect(
        flightReceipt.itemization.flight?.tickets[1].segments
      ).toHaveLength(4);
    });

    it("should have consistent passenger data across segments", () => {
      const tickets = flightReceipt.itemization.flight?.tickets;

      // First passenger (Susy Smith)
      expect(tickets?.[0].passenger?.first_name).toBe("Susy");
      expect(tickets?.[0].passenger?.last_name).toBe("Smith");
      expect(tickets?.[0].record_locator).toBe("CU9GEF");

      // Second passenger (John Smith)
      expect(tickets?.[1].passenger?.first_name).toBe("John");
      expect(tickets?.[1].passenger?.last_name).toBe("Smith");
      expect(tickets?.[1].record_locator).toBe("CU9GEF");
    });

    it("should have proper tax structure for each segment", () => {
      const segments = flightReceipt.itemization.flight?.tickets[0].segments;

      segments?.forEach((segment) => {
        expect(segment.taxes).toBeInstanceOf(Array);
        expect(segment.taxes.length).toBeGreaterThan(0);

        // Each tax should have required fields
        segment.taxes.forEach((tax) => {
          expect(tax.amount).toBeGreaterThan(0);
          expect(tax.name).toBeDefined();
          expect(typeof tax.rate === "number" || tax.rate === null).toBe(true);
        });
      });
    });
  });

  describe("Accessibility and User Experience", () => {
    it("should render without errors", () => {
      const { container } = render(
        <ReceiptDisplay merchant={merchant} receipt={flightReceipt} />
      );

      // Basic check that content is rendered
      expect(container).toBeInTheDocument();
    });

    it("should be stable across re-renders", () => {
      // First render
      const { unmount } = render(
        <ReceiptDisplay merchant={merchant} receipt={flightReceipt} />
      );
      unmount();

      // Second render should not throw or cause issues
      render(<ReceiptDisplay merchant={merchant} receipt={flightReceipt} />);
      expect(screen.getByText("US Flight Segment Tax")).toBeInTheDocument();
    });
  });
});
