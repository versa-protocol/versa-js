import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt, Address } from "@versaprotocol/schema";

export function Parties(
  doc: jsPDF,
  sellerTitle: string,
  sellerAddress: string,
  buyerData: string[][],
  margin: number
): { y: number; page: number } {
  // Set up
  const docWidth = doc.internal.pageSize.getWidth();
  const twoUpStartY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + margin;
  const twoUpStartPage = doc.getCurrentPageInfo().pageNumber;

  if (sellerAddress.length > 0 || buyerData.length > 0) {
    // Seller
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
    doc.setPage(twoUpStartPage);
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
    return cursor;
  } else {
    return {
      y: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY,
      page: doc.getCurrentPageInfo().pageNumber,
    };
  }
}
