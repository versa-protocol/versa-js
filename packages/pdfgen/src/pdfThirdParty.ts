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
      .finalY + margin;

  const bannerHeight = 0.5;
  const bannerWidth = docWidth - 2 * margin;

  doc.setDrawColor(230);
  doc.setLineWidth((1 / 72) * 0.75);
  doc.rect(margin, bannerY, bannerWidth, bannerHeight);

  const text = `${tp.merchant?.name || "Third party"} via ${merchant.name}`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(text, margin + 0.125, bannerY + bannerHeight / 2 + 9 / 72 / 3);

  const boxLogo = tp.make_primary ? merchant.logo : tp.merchant?.logo;
  if (boxLogo) {
    const logoSize = 0.3;
    const logoX = margin + bannerWidth - 0.125 - logoSize;
    const logoY = bannerY + (bannerHeight - logoSize) / 2;
    const options = {
      string: true,
      headers: { "User-Agent": "versa-pdfgen" },
    };
    try {
      const base64Image = (await encode(boxLogo, options)) as string;
      doc.addImage(base64Image, "JPEG", logoX, logoY, logoSize, logoSize);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Error fetching and encoding third-party logo:", e);
    }
  }

  (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY =
    bannerY + bannerHeight;
}
