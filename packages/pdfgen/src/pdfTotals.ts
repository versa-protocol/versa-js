import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Receipt, Adjustment, Tax } from "@versaprotocol/schema";
import {
  aggregateAdjustments,
  aggregateTaxes,
  capitalize,
  formatUSD,
} from "@versaprotocol/belt";

export function Totals(doc: jsPDF, receipt: Receipt, margin: number) {
  const docWidth = doc.internal.pageSize.getWidth();
  let totalsData: {}[] = [];
  totalsData.push({
    description: { content: "Subtotal" },
    amount: {
      content: formatUSD(receipt.header.subtotal / 100),
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    },
  });
  const aggregatedAdjustments: Adjustment[] | null = aggregateAdjustments(
    receipt.itemization
  );
  if (aggregatedAdjustments) {
    aggregatedAdjustments.forEach((a) => {
      let description = "";
      if (a.name) {
        description = capitalize(a.name);
      } else {
        description = capitalize(a.adjustment_type);
      }
      if (a.rate) {
        description += " (" + a.rate * 100 + "%)";
      }
      totalsData.push({
        description: { content: description },
        amount: {
          content: formatUSD(a.amount / 100),
          styles: {
            halign: "right",
            cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
          },
        },
      });
    });
  }
  const aggregatedTaxes: Tax[] = aggregateTaxes(receipt.itemization);
  if (aggregatedTaxes) {
    aggregatedTaxes.forEach((t) => {
      let taxLabel = t.name;
      if (t.rate) {
        taxLabel = taxLabel + " (" + t.rate * 100 + "%)";
      }
      totalsData.push({
        description: { content: taxLabel },
        amount: {
          content: formatUSD(t.amount / 100),
          styles: {
            halign: "right",
            cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
          },
        },
      });
    });
  }
  totalsData.push({
    description: {
      content: "Total in " + receipt.header.currency.toUpperCase(),
    },
    amount: {
      content: formatUSD(receipt.header.total / 100),
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    },
  });
  totalsData.push({
    description: {
      content: "Amount Paid",
      styles: {
        fontStyle: "bold",
      },
    },
    amount: {
      content: formatUSD(receipt.header.paid / 100),
      styles: {
        halign: "right",
        fontStyle: "bold",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    },
  });
  autoTable(doc, {
    body: totalsData,
    startY:
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + margin,
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
      cellPadding: { top: 0.09375, right: 0.125, bottom: 0.09375, left: 0 },
    },
    pageBreak: "avoid",
  });
}
