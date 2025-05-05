import { Org, Receipt } from "@versaprotocol/schema";
import { createReceiptDoc } from "@versaprotocol/pdfgen";
import { epochToISO8601 } from "@versaprotocol/belt";

export const usePdfGen = ({
  merchant,
  receipt,
  brandColor,
}: {
  merchant: Org;
  receipt: Receipt;
  brandColor: string;
}) => {
  const downloadReceipt = async () => {
    const doc = await createReceiptDoc({
      merchant,
      receipt,
      brandColor,
    });
    doc.save(
      merchant.name + " Invoice " + epochToISO8601(receipt.header.invoiced_at)
    );
  };

  const downloadInvoice = () => {
    alert("Download Invoice");
  };

  return {
    downloadInvoice,
    downloadReceipt,
  };
};
