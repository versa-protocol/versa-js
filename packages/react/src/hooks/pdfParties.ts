import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt, Address } from "@versaprotocol/schema";

export function Parties(
  doc: jsPDF,
  merchant: Org,
  header: Receipt["header"],
  margin: number
): { y: number; page: number } {
  // Set up
  const docWidth = doc.internal.pageSize.getWidth();
  const twoUpStartY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + margin;
  const twoUpStartPage = doc.getCurrentPageInfo().pageNumber;

  // Seller
  const sellerTitle = merchant.legal_name ? merchant.legal_name : merchant.name;
  const sellerAddress = stringifyAddress(merchant.address);

  autoTable(doc, {
    head: [[sellerTitle]],
    body: [[sellerAddress]],
    startY: twoUpStartY,
    margin: {
      top: margin,
      right: docWidth / 2 + margin,
      bottom: 2 * margin,
      left: margin,
    },
    theme: "plain",
    showHead: "firstPage",
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

  let cursor = {
    y: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY,
    page: doc.getCurrentPageInfo().pageNumber,
  };

  // Buyer
  if (header.customer) {
    doc.setPage(twoUpStartPage);
    let buyerData: string[][] = [];
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

    autoTable(doc, {
      head: [["Bill To"]],
      body: buyerData,
      startY: twoUpStartY,
      margin: {
        top: margin,
        right: margin * 2,
        bottom: 2 * margin,
        left: docWidth / 2,
      },
      theme: "plain",
      showHead: "firstPage",
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

    cursor = {
      y: Math.max(
        cursor.y,
        (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY
      ),
      page: Math.max(cursor.page, doc.getCurrentPageInfo().pageNumber),
    };
  }

  return cursor;
}

// Helpers

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
