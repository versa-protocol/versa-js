import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt, Address } from "@versa/schema";
import { formatPhoneNumber, Optional } from "@versa/belt";
import { formatAddressMultiline } from "@versa/belt";

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
  const header = receipt.header;
  const primarySeller =
    header.third_party?.make_primary && !!header.third_party?.merchant
      ? header.third_party.merchant
      : merchant;
  const sellerTitle = primarySeller.legal_name
    ? primarySeller.legal_name
    : primarySeller.name;

  const sellerAddress = stringifyAddress(merchant.address);
  const { rows: billTo, websiteRows } = getBillTo(receipt.header);
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
      fontSize: 9,
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
        fontSize: 9,
        cellPadding: {
          top: 0,
          right: 0.125,
          bottom: 0.0625,
          left: 0,
        },
      },
      didParseCell: (data) => {
        if (data.section === "body" && websiteRows.has(data.row.index)) {
          data.cell.styles.textColor = [37, 99, 235];
        }
      },
      didDrawCell: (data) => {
        if (data.section === "body" && websiteRows.has(data.row.index)) {
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            { url: data.cell.text.join("") }
          );
        }
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
        fontSize: 9,
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
  return formatAddressMultiline(address || undefined);
}

function getBillTo(header: Receipt["header"]): {
  rows: string[][];
  websiteRows: Set<number>;
} {
  const rows: string[][] = [];
  const websiteRows = new Set<number>();
  if (header.customer) {
    if (header.customer.name) {
      rows.push([header.customer.name]);
    }
    if (header.customer.address) {
      rows.push([stringifyAddress(header.customer?.address)]);
    }
    if (header.customer.email) {
      rows.push([header.customer.email]);
    }
    if (header.customer.website) {
      websiteRows.add(rows.length);
      rows.push([header.customer.website]);
    }
    if (header.customer.phone) {
      rows.push([formatPhoneNumber(header.customer.phone)]);
    }
    if (header.customer.metadata && header.customer.metadata.length > 0) {
      header.customer.metadata.forEach((m) => {
        rows.push([m.key + ": " + m.value]);
      });
    }
  }
  return { rows, websiteRows };
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
