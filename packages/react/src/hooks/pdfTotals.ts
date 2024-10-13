import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Org, Receipt } from "@versaprotocol/schema";

export function Totals(doc: jsPDF, receipt: Receipt, margin: number) {
  const docWidth = doc.internal.pageSize.getWidth();

  let totalsData = [];
  totalsData.push(["Subtotal", receipt.header.subtotal]);
  totalsData.push(["Total", receipt.header.total]);

  autoTable(doc, {
    body: totalsData,
    startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY,
    margin: {
      top: margin,
      right: margin,
      bottom: 2 * margin,
      left: docWidth / 2,
    },
    theme: "plain",
    bodyStyles: {
      lineColor: 240,
      lineWidth: {
        bottom: (1 / 72) * 0.75,
      },
      fontSize: 10,
      cellPadding: 0.125,
    },
  });
}
