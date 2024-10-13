import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function Items(
  doc: jsPDF,
  margin: number,
  cursor: { y: number; page: number }
) {
  doc.setPage(cursor.page);

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
}
