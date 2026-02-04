import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Receipt, Adjustment, Tax } from "@versa/schema";
import {
  aggregateAdjustments,
  aggregateTaxes,
  capitalize,
  formatPercentage,
  formatTransactionValue,
} from "@versa/belt";

export function Totals(doc: jsPDF, receipt: Receipt, margin: number) {
  const headerCurrency = receipt.header.currency || "";
  const docWidth = doc.internal.pageSize.getWidth();
  const totalsData: {}[] = [];
  totalsData.push({
    description: { content: "Subtotal" },
    amount: {
      content: formatTransactionValue(receipt.header.subtotal, headerCurrency),
      styles: {
        halign: "right",
        cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
      },
    },
  });
  const aggregatedTaxes: Tax[] = aggregateTaxes(receipt.itemization);
  if (aggregatedTaxes) {
    aggregatedTaxes.forEach((t) => {
      let taxLabel = t.name;
      if (t.rate) {
        taxLabel = taxLabel + " (" + formatPercentage(t.rate) + "%)";
      }
      totalsData.push({
        description: { content: taxLabel },
        amount: {
          content: formatTransactionValue(t.amount, headerCurrency),
          styles: {
            halign: "right",
            cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
          },
        },
      });
    });
  }
  const aggregatedAdjustments: Adjustment[] | null =
    aggregateAdjustments(receipt.itemization) || null;
  if (aggregatedAdjustments) {
    aggregatedAdjustments.forEach((a) => {
      let description = "";
      if (a.name) {
        description = capitalize(a.name);
      } else {
        description = capitalize(a.adjustment_type);
      }
      if (a.rate) {
        description += " (" + formatPercentage(a.rate) + "%)";
      }
      totalsData.push({
        description: { content: description },
        amount: {
          content: formatTransactionValue(a.amount, headerCurrency),
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
      content: "Total in " + headerCurrency.toUpperCase(),
    },
    amount: {
      content: formatTransactionValue(receipt.header.total, headerCurrency),
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
      content: formatTransactionValue(receipt.header.paid, headerCurrency),
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
