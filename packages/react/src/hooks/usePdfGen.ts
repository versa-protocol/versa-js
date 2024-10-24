import { Address, Org, Receipt } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import { Header } from "./pdfHeader";
import { Parties } from "./pdfParties";
import { TypeSubHeader } from "./pdfTypeSubHeader";
import { Items } from "./pdfItems";
import { Totals } from "./pdfTotals";
import { Payments } from "./pdfPayments";
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

  const downloadReceipt = async () => {
    // Doc set up
    const doc = new jsPDF({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });
    doc.setLineWidth((1 / 72) * 0.75);
    const sellerTitle = merchant.legal_name
      ? merchant.legal_name
      : merchant.name;
    const sellerAddress = stringifyAddress(merchant.address);
    const buyerData: string[][] = getBuyerData(receipt.header);
    const showSellerinHeader =
      sellerAddress.length == 0 && buyerData.length == 0;

    // Header
    Header(doc, merchant, receipt, margin, brandColor, showSellerinHeader);

    // Parties
    let cursor = Parties(doc, sellerTitle, sellerAddress, buyerData, margin);

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

    // Footers
    Footers(doc, margin);

    // Save
    doc.save(
      merchant.name + " Invoice " + epochToISO8601(receipt.header.invoiced_at)
    );
  };

  const downloadInvoice = () => {
    alert("Download Invoice");
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

function stringifyAddress(address: Address | null | undefined): string {
  let addressString = "";
  if (address) {
    if (address.street_address) {
      addressString = addressString.concat(address.street_address);
    }
    if (address.city || address.region || address.postal_code) {
      addressString = addressString.concat("\n");
      if (address.city) {
        addressString = addressString.concat(address.city);
      }
      if (address.region) {
        addressString = addressString.concat(", ", address.region);
      }
      if (address.postal_code) {
        addressString = addressString.concat(" ", address.postal_code);
      }
    }
    if (address.country) {
      addressString = addressString.concat("\n", address.country);
    }
  }
  return addressString;
}

function getBuyerData(header: Receipt["header"]) {
  let buyerData: string[][] = [];
  if (header.customer) {
    if (header.customer.name) {
      buyerData.push([header.customer.name]);
    }
    if (header.customer.address) {
      buyerData.push([stringifyAddress(header.customer?.address)]);
    }
    if (header.customer.email) {
      buyerData.push([header.customer.email]);
    }
    if (header.customer.phone) {
      buyerData.push([header.customer.phone]);
    }
  }
  return buyerData;
}
