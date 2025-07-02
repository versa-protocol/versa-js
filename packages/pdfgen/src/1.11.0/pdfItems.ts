import { lts_v1_11_0 } from "@versa/belt";
import { lts } from "@versa/schema";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FlightDetails } from "./pdfFlightDetails";

export async function Items(
  doc: jsPDF,
  receipt: lts.v1_11_0.Receipt,
  margin: number,
  cursor: { y: number; page: number }
) {
  doc.setPage(cursor.page);
  if (receipt.itemization.flight) {
    await FlightDetails(
      doc,
      receipt.itemization.flight,
      receipt.header,
      margin,
      cursor
    );
  } else {
    const aggregatedItems = lts_v1_11_0.aggregateItems(
      receipt.itemization,
      receipt.header
    );
    autoTable(doc, {
      head: [aggregatedItems.head],
      body: aggregatedItems.items,
      startY: cursor.y + margin / 2,
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
