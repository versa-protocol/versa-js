import { jsPDF } from "jspdf";
import { Org, Receipt } from "@versa/schema";
import { encode } from "./encodeImage";

export async function ThirdPartyBanner(
  doc: jsPDF,
  merchant: Org,
  receipt: Receipt,
  margin: number
) {
  const tp = receipt.header.third_party;
  if (!tp) return;

  const docWidth = doc.internal.pageSize.getWidth();
  const bannerY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY +
    margin / 2;

  const logoSize = 0.25;
  const lineHeight = Math.max(logoSize, 9 / 72);

  const boxLogo = tp.make_primary ? merchant.logo : tp.merchant?.logo;
  let textX = margin;

  if (boxLogo) {
    const logoX = margin;
    const logoY = bannerY + (lineHeight - logoSize) / 2;
    const options = {
      string: true,
      headers: { "User-Agent": "versa-pdfgen" },
    };
    try {
      const base64Image = (await encode(boxLogo, options)) as string;
      doc.addImage(base64Image, "JPEG", logoX, logoY, logoSize, logoSize);
      textX = margin + logoSize + 0.125;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Error fetching and encoding third-party logo:", e);
    }
  }

  const text = `${tp.merchant?.name || "Third party"} via ${merchant.name}`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(text, textX, bannerY + lineHeight / 2 + 9 / 72 / 3);

  (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY =
    bannerY + lineHeight;
}
