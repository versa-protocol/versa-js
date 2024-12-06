import { Org, Receipt } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import { Header } from "./pdfHeader";
import { Parties } from "./pdfParties";
import { TypeSubHeader } from "./pdfTypeSubHeader";
import { Items } from "./pdfItems";
import { Totals } from "./pdfTotals";
import { Payments } from "./pdfPayments";
import { Footers } from "./pdfFooters";
import { SupplementalText } from "./pdfSupplementalText";
// import jsdom from "jsdom";
// const { JSDOM } = jsdom
// const JSDOMInstance = new JSDOM();
// global.DOMParser = JSDOMInstance.window.DOMParser
// global.document = JSDOMInstance.window.document;

const margin = 0.375;
export const createReceiptDoc = async ({
  merchant,
  receipt,
  brandColor,
}: {
  merchant: Org;
  receipt: Receipt;
  brandColor: string;
}) => {
  // Doc set up
  const doc = new jsPDF({
    unit: "in",
    format: "letter",
    orientation: "portrait",
  });
  doc.setLineWidth((1 / 72) * 0.75);

  // Header
  await Header(doc, merchant, receipt, margin, brandColor);

  // Parties
  let cursor = Parties(doc, merchant, receipt, margin);

  // Type-Specific Sub-Headers
  cursor = TypeSubHeader(doc, receipt, margin, cursor);

  // Items
  await Items(doc, receipt, margin, cursor);

  // Totals
  Totals(doc, receipt, margin);

  // Payments
  if (receipt.payments.length > 1) {
    Payments(doc, receipt.payments, margin);
  }

  // Supplemental Text
  if (receipt.footer.supplemental_text) {
    SupplementalText(doc, receipt.footer.supplemental_text, margin);
  }

  // Page number footer
  Footers(doc, margin);

  // Save
  return doc;
};

// Helpers

function epochToISO8601(epochTime: number): string {
  const date = new Date(epochTime * 1000);
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
