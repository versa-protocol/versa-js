import { lts } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import { Header } from "../pdfHeader";
import { Parties } from "../pdfParties";
import { TypeSubHeader } from "../pdfTypeSubHeader";
import { Items } from "./pdfItems";
import { Totals } from "../pdfTotals";
import { Payments } from "../pdfPayments";
import { Footers } from "../pdfFooters";
import { SupplementalText } from "../pdfSupplementalText";

const margin = 0.375;

export const createReceiptDoc_v1_11_0 = async ({
  merchant,
  receipt,
  brandColor,
}: {
  merchant: lts.v1_11_0.Org;
  receipt: lts.v1_11_0.Receipt;
  brandColor: string;
}) => {
  // Doc set up
  const doc = new jsPDF({
    unit: "in",
    format: "letter",
    orientation: "portrait",
  });
  doc.setLineWidth((1 / 72) * 0.75);

  // Cast to latest types for shared components
  const merchantLatest = merchant as any;
  const receiptLatest = receipt as any;

  // Header
  await Header(doc, merchantLatest, receiptLatest, margin, brandColor);

  // Parties
  let cursor = Parties(doc, merchantLatest, receiptLatest, margin);

  // Type-Specific Sub-Headers
  cursor = TypeSubHeader(doc, receiptLatest, margin, cursor);

  // Items (using version-specific implementation)
  await Items(doc, receipt, margin, cursor);

  // Totals
  Totals(doc, receiptLatest, margin);

  // Payments
  if (receipt.payments.length > 1) {
    Payments(doc, receiptLatest.payments, receiptLatest.header, margin);
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
