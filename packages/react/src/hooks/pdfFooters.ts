import { jsPDF } from "jspdf";

export function Footers(doc: jsPDF, margin: number) {
  const docWidth = doc.internal.pageSize.getWidth();
  const pageCount = doc.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (var i = 1; i <= pageCount; i++) {
    doc.line(margin, 10.5, docWidth - margin, 10.5);
    doc.setPage(i);
    doc.text("Page " + String(i) + " of " + String(pageCount), margin, 10.75);
  }
}
