import { jsPDF } from "jspdf";

export function Footers(doc: jsPDF, margin: number) {
  const pageCount = doc.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text("Page " + String(i) + " of " + String(pageCount), margin, 10.75);
  }
}
