import { aggregateItems } from "@versaprotocol/belt";
import { Receipt } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FlightDetails } from "./pdfFlightDetails";

export async function Items(
  doc: jsPDF,
  receipt: Receipt,
  margin: number,
  cursor: { y: number; page: number }
) {
  doc.setPage(cursor.page);
  if (receipt.itemization.flight) {
    await FlightDetails(doc, receipt.itemization.flight, margin, cursor);
  } else {
    const aggregatedItems = aggregateItems(receipt.itemization);
    autoTable(doc, {
      head: [aggregatedItems.head],
      body: aggregatedItems.items,
      startY: cursor.y + margin,
      margin: { top: margin, right: margin, bottom: 2 * margin, left: margin },
      theme: "plain",
      headStyles: {
        lineColor: 120,
        lineWidth: {
          bottom: (1 / 72) * 0.75,
        },
        fontSize: 8,
        cellPadding: {
          top: 0.09375,
          right: 0.125,
          bottom: 0.09375,
          left: 0,
        },
      },
      bodyStyles: {
        lineColor: 240,
        lineWidth: {
          bottom: (1 / 72) * 0.75,
        },
        fontSize: 10,
        cellPadding: { top: 0.125, right: 0.125, bottom: 0.125, left: 0 },
      },
    });
  }
}
