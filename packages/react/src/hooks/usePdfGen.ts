import { Org, Receipt } from "@versaprotocol/schema";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
export const usePdfGen = ({
  merchant,
  header,
  brandColor,
}: {
  merchant: Org;
  header: Receipt["header"];
  brandColor: string;
}) => {
  const margin = 0.375;

  const addFooters = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("Page " + String(i) + " of " + String(pageCount), margin, 10.75);
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });
    const docWidth = doc.internal.pageSize.getWidth();
    doc.setLineWidth((1 / 72) * 0.75);

    // Brand stripe
    const [brandR, brandG, brandB] = hexToRgb(brandColor);
    doc.setFillColor(brandR, brandG, brandB);
    doc.rect(0, 0, docWidth, 0.0625, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setLineHeightFactor(1.25);
    doc.setFontSize(24);
    doc.text("Invoice", margin, margin + 24 / 72);

    // Logo
    let logo = null;
    if (merchant.logo) {
      logo = merchant.logo;
    }
    if (
      header.third_party &&
      header.third_party.make_primary &&
      header.third_party.merchant.logo
    ) {
      logo = header.third_party.merchant.logo;
    }
    {
      logo && doc.addImage(logo, "JPEG", docWidth - margin - 1, margin, 1, 1);
    }
    doc.setDrawColor(240);
    doc.rect(docWidth - margin - 1, margin, 1, 1, "S");

    // Head Table
    let headTableData: (string | number)[][] = [
      ["Invoice Date:", formatDate(header.invoiced_at)],
    ];
    if (header.invoice_number) {
      headTableData.push(["Invoice Number:", header.invoice_number]);
    }
    autoTable(doc, {
      body: headTableData,
      startY: 1,
      margin: { top: margin, right: margin, bottom: 2 * margin, left: margin },
      theme: "plain",
      tableWidth: "wrap",
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

    // Parties Table
    const billToString = header.customer ? "Bill To" : "";
    const billFromString = merchant.legal_name
      ? merchant.legal_name
      : merchant.name;
    const partiesTableHead: (string | number)[][] = [
      [billFromString, billToString],
    ];
    let sellerAddress = "";
    if (merchant.address) {
      if (merchant.address.street_address) {
        sellerAddress = sellerAddress.concat(merchant.address.street_address);
      }
      if (
        merchant.address.city ||
        merchant.address.region ||
        merchant.address.postal_code
      ) {
        sellerAddress = sellerAddress.concat("\n");
        if (merchant.address.city) {
          sellerAddress = sellerAddress.concat(merchant.address.city);
        }
        if (merchant.address.region) {
          sellerAddress = sellerAddress.concat(", ", merchant.address.region);
        }
        if (merchant.address.postal_code) {
          sellerAddress = sellerAddress.concat(
            " ",
            merchant.address.postal_code
          );
        }
      }
      if (merchant.address.country) {
        sellerAddress = sellerAddress.concat("\n", merchant.address.country);
      }
    }
    let buyer = "";
    if (header.customer) {
      if (header.customer.name) {
        buyer = buyer.concat(header.customer.name);
      }
      if (header.customer.email) {
        buyer = buyer.concat("\n", header.customer.email);
      }
      if (header.customer.phone) {
        buyer = buyer.concat("\n", header.customer.phone);
      }
      if (header.customer.address?.street_address) {
        buyer = buyer.concat("\n", header.customer.address?.street_address);
      }
      if (
        header.customer.address?.city ||
        header.customer.address?.region ||
        header.customer.address?.postal_code
      ) {
        buyer = buyer.concat("\n");
        if (header.customer.address?.city) {
          buyer = buyer.concat(header.customer.address?.city);
        }
        if (header.customer.address?.region) {
          buyer = buyer.concat(", ", header.customer.address?.region);
        }
        if (header.customer.address?.postal_code) {
          buyer = buyer.concat(" ", header.customer.address?.postal_code);
        }
      }
      if (header.customer.address?.country) {
        buyer = buyer.concat("\n", header.customer.address?.country);
      }
    }
    if (sellerAddress.length > 0 || buyer.length > 0) {
      autoTable(doc, {
        head: partiesTableHead,
        body: [[sellerAddress, buyer]],
        startY:
          (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
            .finalY +
          margin / 2,
        margin: {
          top: margin,
          right: margin,
          bottom: 2 * margin,
          left: margin,
        },
        theme: "plain",
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
    }
    // Itemization Table
    const tableHead: (string | number)[][] = [
      ["ID", "Name", "Email", "Country", "IP Address"],
    ];

    const tableData: (string | number)[][] = [
      [1, "Alice", "alice@example.com", "USA", "192.168.1.1"],
      [2, "Bob", "bob@example.com", "Canada", "192.168.1.2"],
      [3, "Charlie", "charlie@example.com", "UK", "192.168.1.3"],
      [1, "Alice", "alice@example.com", "USA", "192.168.1.1"],
      [2, "Bob", "bob@example.com", "Canada", "192.168.1.2"],
      [3, "Charlie", "charlie@example.com", "UK", "192.168.1.3"],
      [1, "Alice", "alice@example.com", "USA", "192.168.1.1"],
      [2, "Bob", "bob@example.com", "Canada", "192.168.1.2"],
      [3, "Charlie", "charlie@example.com", "UK", "192.168.1.3"],
      [1, "Alice", "alice@example.com", "USA", "192.168.1.1"],
      [2, "Bob", "bob@example.com", "Canada", "192.168.1.2"],
      [3, "Charlie", "charlie@example.com", "UK", "192.168.1.3"],
    ];

    autoTable(doc, {
      head: tableHead,
      body: tableData,
      startY:
        (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + margin,
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
          left: 0.125,
        },
      },
      bodyStyles: {
        lineColor: 240,
        lineWidth: {
          bottom: (1 / 72) * 0.75,
        },
        fontSize: 10,
        cellPadding: 0.125,
      },
    });

    // Footers
    addFooters(doc);

    // Save with filename
    doc.save(merchant.name + " Invoice " + epochToISO8601(header.invoiced_at));
  };

  const downloadReceipt = () => {
    alert("Download Receipt");
  };

  return {
    downloadInvoice,
    downloadReceipt,
  };
};

// Helpers

function epochToISO8601(epochTime: number): string {
  const date = new Date(epochTime * 1000);
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function formatDate(secondsSinceEpoch: number) {
  var d = new Date(secondsSinceEpoch * 1000);
  var options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", options);
}
