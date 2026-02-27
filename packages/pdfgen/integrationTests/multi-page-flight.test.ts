import test from "ava";
import { Org, Receipt } from "@versa/schema";
import { pdfToPages, pdfToItemsWithPosition } from "./helpers";
import { createReceiptDoc } from "../src";

import multiPageFlightReceipt from "./fixtures/multi-page-flight.json";

const merchant: Org = {
  name: "Food and Nutrition Strategies, LLC",
  website: "https://skysailfoods.com/team",
};

/**
 * E2E test: Confirms that when a flight receipt with many segments wraps to a
 * second page, the Totals section (Subtotal, Taxes, Total, Amount Paid) is
 * rendered correctly without overlapping the flight content.
 *
 * This receipt has 5 segments (BOS→JFK→DOH→SIN→DOH→BOS) which forces
 * content onto multiple pages.
 */
test("multi-page flight receipt - totals do not overlap flight content", async (t) => {
  const doc = await createReceiptDoc({
    merchant,
    receipt: multiPageFlightReceipt as unknown as Receipt,
    brandColor: "#000000",
  });

  const buffer = Buffer.from(doc.output("arraybuffer"));
  const pages = await pdfToPages(buffer);

  // Use a fresh buffer for position extraction (arraybuffer may detach after pdfToPages)
  const bufferForPositions = Buffer.from(doc.output("arraybuffer"));
  const items = await pdfToItemsWithPosition(bufferForPositions);

  // Receipt with 5 segments should span multiple pages
  t.true(
    pages.length >= 2,
    "PDF should have at least 2 pages when flight content wraps"
  );

  // Find totals-related items (labels from pdfTotals)
  const totalsLabels = ["Subtotal", "Amount Paid", "Total in"];
  const totalsItems = items.filter((item) =>
    totalsLabels.some((label) => item.str.includes(label))
  );

  t.true(totalsItems.length >= 2, "Totals section should appear in PDF");

  // Find flight segment content (airport codes from the 5 segments)
  const flightCodes = ["BOS", "JFK", "DOH", "SIN"];
  const flightItems = items.filter((item) =>
    flightCodes.some((code) => item.str === code)
  );

  t.true(
    flightItems.length >= 4,
    "Flight segment content should appear in PDF"
  );

  // On each page, verify no overlap: totals must be below (smaller Y) any
  // flight content on the same page. PDF coords: y=0 at bottom, y increases up.
  // So "totals below flight" means totals.y < flight.y (totals closer to bottom).
  for (const pageNum of [...new Set(items.map((i) => i.page))]) {
    const pageItems = items.filter((i) => i.page === pageNum);
    const pageTotals = pageItems.filter((item) =>
      totalsLabels.some((label) => item.str.includes(label))
    );
    const pageFlight = pageItems.filter((item) =>
      flightCodes.some((code) => item.str === code)
    );

    if (pageTotals.length > 0 && pageFlight.length > 0) {
      const totalsYRange = {
        min: Math.min(...pageTotals.map((i) => i.y)),
        max: Math.max(...pageTotals.map((i) => i.y)),
      };
      const flightYRange = {
        min: Math.min(...pageFlight.map((i) => i.y)),
        max: Math.max(...pageFlight.map((i) => i.y)),
      };
      // Totals must be entirely below flight content: top of totals < bottom of flight
      t.true(
        totalsYRange.max < flightYRange.min,
        `On page ${pageNum}: Totals (y max=${totalsYRange.max.toFixed(
          0
        )}) must be below flight content (y min=${flightYRange.min.toFixed(
          0
        )}) - no overlap`
      );
    }
  }

  // Sanity: key content appears
  const fullText = pages.map((p) => p.text).join("\n");
  t.true(fullText.includes("Subtotal"), "Subtotal should appear");
  t.true(fullText.includes("Amount Paid"), "Amount Paid should appear");
  t.true(
    fullText.includes("Food and Nutrition Strategies"),
    "Merchant name should appear"
  );
  t.true(fullText.includes("NPNPNP"), "Record locator should appear");
});
