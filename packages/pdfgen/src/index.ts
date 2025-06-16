import { Org, Receipt, LTS_VERSIONS, lts } from "@versaprotocol/schema";
import { compareSchemaVersions } from "@versaprotocol/belt";
import { jsPDF } from "jspdf";
import { Header } from "./pdfHeader";
import { Parties } from "./pdfParties";
import { TypeSubHeader } from "./pdfTypeSubHeader";
import { Items } from "./pdfItems";
import { Totals } from "./pdfTotals";
import { Payments } from "./pdfPayments";
import { Footers } from "./pdfFooters";
import { SupplementalText } from "./pdfSupplementalText";
import { createReceiptDoc_v1_11_0 } from "./1.11.0";
// import jsdom from "jsdom";
// const { JSDOM } = jsdom
// const JSDOMInstance = new JSDOM();
// global.DOMParser = JSDOMInstance.window.DOMParser
// global.document = JSDOMInstance.window.document;

const margin = 0.375;

// Main function that handles version branching
export const createReceiptDoc = async ({
  merchant,
  receipt,
  brandColor,
}: {
  merchant: Org;
  receipt: Receipt;
  brandColor: string;
}) => {
  const schemaVersion = receipt.schema_version;

  // Log warnings for unsupported versions
  if (!LTS_VERSIONS.includes(schemaVersion)) {
    if (
      compareSchemaVersions(
        LTS_VERSIONS[LTS_VERSIONS.length - 1],
        schemaVersion
      ) === 1
    ) {
      console.warn(
        `WARN: Received schema version that has been retired; contact Versa support if this is a recent receipt. (Received version: ${schemaVersion})`
      );
    } else {
      console.warn(
        `WARN: Received schema version that is newer than the latest supported version; update your Versa library at your earliest convenience. (Received version: ${schemaVersion})`
      );
    }
  }

  // Route to version-specific implementation
  if (
    schemaVersion === "1.11.0" ||
    schemaVersion === "1.10.0" ||
    schemaVersion === "1.9.0" ||
    schemaVersion === "1.8.0"
  ) {
    return createReceiptDoc_v1_11_0({
      merchant: merchant as lts.v1_11_0.Org,
      receipt: receipt as lts.v1_11_0.Receipt,
      brandColor,
    });
  }

  // 2.0.0-rc2 and later use the latest implementation
  return createReceiptDocLatest({ merchant, receipt, brandColor });
};

// Latest version implementation (supports Person type)
const createReceiptDocLatest = async ({
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
    Payments(doc, receipt.payments, receipt.header, margin);
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
