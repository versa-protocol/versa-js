import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Header, Payment } from "@versa/schema";
import { formatDateTimeWithPlaces } from "@versa/belt";

export function Payments(
  doc: jsPDF,
  payments: Payment[],
  header: Header,
  margin: number
) {
  const docWidth = doc.internal.pageSize.getWidth();
  const paymentsData: {}[] = [];
  payments.forEach((p) => {
    let paymentDescription = "";
    let paymentType = "";
    if (p.payment_type == "card") {
      paymentType = "Card Payment";
      paymentDescription = paymentMethod(p);
    } else {
      paymentType = "Bank Payment";
    }
    paymentType = paymentType.concat(
      "\n",
      formatDateTimeWithPlaces(p.paid_at, [header.location], {
        includeTime: true,
        includeTimezone: true,
      })
    );
    paymentsData.push({
      label: { content: paymentType },
      value: {
        content: paymentDescription,
        styles: {
          halign: "right",
          cellPadding: { top: 0.09375, right: 0, bottom: 0.09375, left: 0 },
        },
      },
    });
  });

  autoTable(doc, {
    body: paymentsData,
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
  });
}

// Helpers

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function paymentMethod(p: Payment) {
  let paymentDescription = "";
  if (p.payment_type == "card") {
    if (p.card_payment?.network) {
      paymentDescription = toTitleCase(p.card_payment.network);
      if (p.card_payment.last_four) {
        paymentDescription = paymentDescription.concat(
          " ··· ",
          p.card_payment.last_four
        );
      }
    }
  }
  return paymentDescription;
}
