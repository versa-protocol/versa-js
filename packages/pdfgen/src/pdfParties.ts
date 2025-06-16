import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt, Address } from "@versaprotocol/schema";
import { formatPhoneNumber, Optional } from "@versaprotocol/belt";

export function Parties(
  doc: jsPDF,
  merchant: Org,
  receipt: Receipt,
  margin: number
): { y: number; page: number } {
  // Set up
  const docWidth = doc.internal.pageSize.getWidth();
  const partiesStartY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + margin;
  const partiesStartPage = doc.getCurrentPageInfo().pageNumber;
  const sellerTitle = merchant.legal_name ? merchant.legal_name : merchant.name;
  const sellerAddress = stringifyAddress(merchant.address);
  const billTo: string[][] = getBillTo(receipt.header);
  const shipTo: string[][] = getShipTo(receipt.itemization);

  // Seller
  autoTable(doc, {
    head: [[sellerTitle]],
    body: [[sellerAddress]],
    startY: partiesStartY,
    margin: {
      top: margin,
      right: docWidth / 2 + margin / 2,
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

  // Bill To
  if (billTo.length > 0) {
    doc.setPage(partiesStartPage);
    let rightOffset = margin + margin / 2;
    if (shipTo.length > 0) {
      rightOffset = docWidth / 4 + margin;
    }
    autoTable(doc, {
      head: [["Bill To"]],
      body: billTo,
      startY: partiesStartY,
      margin: {
        top: margin,
        right: rightOffset,
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

  // Ship To
  if (shipTo.length > 0) {
    doc.setPage(partiesStartPage);
    let leftOffset = docWidth / 2;
    if (billTo.length > 0) {
      leftOffset += docWidth / 4 - margin / 2;
    }
    autoTable(doc, {
      head: [["Ship To"]],
      body: shipTo,
      startY: partiesStartY,
      margin: {
        top: margin,
        right: margin + margin / 2,
        bottom: 2 * margin,
        left: leftOffset,
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

function stringifyAddress(address: Optional<Address>): string {
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

function getBillTo(header: Receipt["header"]) {
  const billTo: string[][] = [];
  if (header.customer) {
    if (header.customer.name) {
      billTo.push([header.customer.name]);
    }
    if (header.customer.address) {
      billTo.push([stringifyAddress(header.customer?.address)]);
    }
    if (header.customer.email) {
      billTo.push([header.customer.email]);
    }
    if (header.customer.website) {
      billTo.push([header.customer.website]);
    }
    if (header.customer.phone) {
      billTo.push([formatPhoneNumber(header.customer.phone)]);
    }
    if (header.customer.metadata && header.customer.metadata.length > 0) {
      header.customer.metadata.forEach((m) => {
        billTo.push([m.key + ": " + m.value]);
      });
    }
  }
  return billTo;
}

function getShipTo(itemization: Receipt["itemization"]) {
  const shipTo: string[][] = [];
  if (
    itemization.ecommerce &&
    itemization.ecommerce.shipments &&
    itemization.ecommerce.shipments.length === 1 &&
    itemization.ecommerce.shipments[0].destination_address
  ) {
    shipTo.push([
      stringifyAddress(itemization.ecommerce.shipments[0].destination_address),
    ]);
  }
  return shipTo;
}
