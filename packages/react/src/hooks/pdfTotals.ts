import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Receipt, Adjustment, Tax } from "@versaprotocol/schema";
import {
  aggregateAdjustments,
  aggregateTaxes,
  formatUSD,
} from "@versaprotocol/belt";

export function Totals(doc: jsPDF, receipt: Receipt, margin: number) {
  const docWidth = doc.internal.pageSize.getWidth();
  let totalsData: {}[] = [];
  totalsData.push({
    description: "Subtotal",
    amount: formatUSD(receipt.header.subtotal / 100),
  });
  const aggregatedAdjustments: Adjustment[] | null = aggregateAdjustments(
    receipt.itemization
  );
  if (aggregatedAdjustments) {
    aggregatedAdjustments.forEach((a) =>
      totalsData.push({
        description: a.adjustment_type,
        amount: formatUSD(a.amount / 100),
      })
    );
  }
  const aggregatedTaxes: Tax[] = aggregateTaxes(receipt.itemization);
  if (aggregatedTaxes) {
    aggregatedTaxes.forEach((t) => {
      let taxLabel = t.name;
      if (t.rate) {
        taxLabel = taxLabel + " (" + t.rate * 100 + "%)";
      }
      totalsData.push({
        description: taxLabel,
        amount: formatUSD(t.amount / 100),
      });
    });
  }
  autoTable(doc, {
    body: totalsData,
    foot: [
      {
        description: "Total",
        amount: formatUSD(receipt.header.total / 100),
      },
    ],
    startY:
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY +
      margin / 2,
    margin: {
      top: margin,
      right: margin,
      bottom: 2 * margin,
      left: docWidth / 2,
    },
    theme: "plain",
    styles: {
      lineColor: 240,
      lineWidth: {
        top: (1 / 72) * 0.75,
      },
      fontSize: 10,
      cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
    },
    footStyles: {
      fontStyle: "bold",
    },
    columnStyles: {
      amount: {
        halign: "right",
      },
    },
  });
}
