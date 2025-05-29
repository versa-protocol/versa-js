import { jsPDF } from "jspdf";

export function Footers(doc: jsPDF, margin: number) {
  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setLineWidth((1 / 72) * 0.75);
    doc.setDrawColor(240);
    doc.line(
      margin,
      docHeight - margin * 1.5 - 10 / 72,
      docWidth - margin,
      docHeight - margin * 1.5 - 10 / 72
    );
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const text = "Page " + String(i) + " of " + String(pageCount);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, docWidth - textWidth - margin, docHeight - margin);
  }
}
