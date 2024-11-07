import { jsPDF } from "jspdf";
import removeMd from "remove-markdown";

export function SupplementalText(
  doc: jsPDF,
  supplemental_text: string,
  margin: number
) {
  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.height;
  const plainText = removeMd(supplemental_text);
  let startY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + margin;
  const splitText = doc
    .setFont("helvetica", "normal")
    .setFontSize(8)
    .splitTextToSize(plainText, docWidth * 0.75 - margin);
  let i = 1;
  const lineHeight = 12 / 72;
  splitText.forEach((line: string) => {
    let posY = startY + lineHeight * i++;
    if (posY > docHeight - margin * 2) {
      doc.addPage();
      i = 1;
      startY = margin;
      posY = startY + lineHeight * i++;
    }
    doc.text(line, margin, posY);
  });
}
