import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt } from "@versaprotocol/schema";

export function Header(
  doc: jsPDF,
  merchant: Org,
  header: Receipt["header"],
  margin: number,
  brandColor: string
) {
  // Brand stripe
  const docWidth = doc.internal.pageSize.getWidth();
  const [brandR, brandG, brandB] = hexToRgb(brandColor);
  doc.setFillColor(brandR, brandG, brandB);
  doc.rect(0, 0, docWidth, 0.0625, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setLineHeightFactor(1.25);
  doc.setFontSize(20);
  doc.text("Receipt", margin, margin + 24 / 72);

  // Logo
  let logo = null;
  if (merchant.logo) {
    logo = merchant.logo;
  }
  if (
    header.third_party &&
    header.third_party.make_primary &&
    header.third_party.merchant.logo
  ) {
    logo = header.third_party.merchant.logo;
  }
  {
    logo && doc.addImage(logo, "JPEG", docWidth - margin - 1, margin, 1, 1);
  }
  doc.setDrawColor(240);
  doc.rect(docWidth - margin - 1, margin, 1, 1, "S");

  // Head Table
  let headTableData: (string | number)[][] = [
    ["Invoice Date:", formatDate(header.invoiced_at)],
  ];
  if (header.invoice_number) {
    headTableData.push(["Invoice Number:", header.invoice_number]);
  }
  autoTable(doc, {
    body: headTableData,
    startY: 1,
    margin: { top: margin, right: margin, bottom: 2 * margin, left: margin },
    theme: "plain",
    tableWidth: "wrap",
    styles: {
      fontSize: 10,
      cellPadding: {
        top: 0,
        right: 0.125,
        bottom: 0.0625,
        left: 0,
      },
    },
  });
}

// Helpers

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function formatDate(secondsSinceEpoch: number) {
  var d = new Date(secondsSinceEpoch * 1000);
  var options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", options);
}
