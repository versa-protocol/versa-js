import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt, Payment } from "@versaprotocol/schema";
import { capitalize } from "@versaprotocol/belt";
import { encode } from "./encodeImage";

export async function Header(
  doc: jsPDF,
  merchant: Org,
  receipt: Receipt,
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
  doc.text("Receipt", margin, margin + 20 / 72);

  // Logo
  let logo: string | null = null;
  if (merchant.logo) {
    logo = merchant.logo;
  }
  if (
    receipt.header.third_party &&
    receipt.header.third_party.make_primary &&
    receipt.header.third_party.merchant?.logo
  ) {
    logo = receipt.header.third_party.merchant.logo;
  }
  if (logo) {
    const options = {
      string: true, // critical to ensure we get a string and not a Buffer
      headers: {
        "User-Agent": "versa-pdfgen",
      },
    };
    try {
      const base64Image = (await encode(logo, options)) as string;
      doc.addImage(base64Image, "JPEG", docWidth - margin - 1, margin, 1, 1);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Error fetching and encoding image:", e);
    }
  }
  doc.setDrawColor(240);
  doc.rect(docWidth - margin - 1, margin, 1, 1, "S");

  // Head Table
  const headTableData: (string | number)[][] = [];
  headTableData.push(["Invoice Date:", formatDate(receipt.header.invoiced_at)]);
  if (receipt.header.invoice_number) {
    headTableData.push(["Invoice Number:", receipt.header.invoice_number]);
  }
  if (
    receipt.payments.length == 1 &&
    receipt.payments[0].amount == receipt.header.paid
  ) {
    headTableData.push(["Date Paid:", formatDate(receipt.payments[0].paid_at)]);
    headTableData.push(["Payment Method:", paymentMethod(receipt.payments[0])]);
  }

  autoTable(doc, {
    body: headTableData,
    startY: margin + 20 / 72 + margin,
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
  const d = new Date(secondsSinceEpoch * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", options);
}

function paymentMethod(p: Payment) {
  let paymentDescription = "";
  if (p.payment_type == "card") {
    if (p.card_payment?.network) {
      paymentDescription = capitalize(p.card_payment.network);
      if (p.card_payment.last_four) {
        paymentDescription = paymentDescription.concat(
          " - ",
          p.card_payment.last_four
        );
      }
    }
  }
  return paymentDescription;
}
