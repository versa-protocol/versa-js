import { Org, Receipt } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import { Header } from "./pdfHeader";
import { Parties } from "./pdfParties";
import { Items } from "./pdfItems";
import { Totals } from "./pdfTotals";
import { Footers } from "./pdfFooters";

export const usePdfGen = ({
  merchant,
  receipt,
  brandColor,
}: {
  merchant: Org;
  receipt: Receipt;
  brandColor: string;
}) => {
  const margin = 0.375;

  const downloadInvoice = () => {
    // Set up
    const doc = new jsPDF({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });
    doc.setLineWidth((1 / 72) * 0.75);

    // Header
    Header(doc, merchant, receipt.header, margin, brandColor);

    // Parties
    let cursor = Parties(doc, merchant, receipt.header, margin);

    // Items
    Items(doc, receipt, margin, cursor);

    // Totals
    Totals(doc, receipt, margin);

    // Footers
    Footers(doc, margin);

    // Save
    doc.save(
      merchant.name + " Invoice " + epochToISO8601(receipt.header.invoiced_at)
    );
  };

  const downloadReceipt = () => {
    alert("Download Receipt");
  };

  return {
    downloadInvoice,
    downloadReceipt,
  };
};

// Helpers

function epochToISO8601(epochTime: number): string {
  const date = new Date(epochTime * 1000);
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
