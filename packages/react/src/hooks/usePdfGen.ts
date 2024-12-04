import { Org, Receipt } from "@versaprotocol/schema";
import { createReceiptDoc } from "@versaprotocol/pdfgen";

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

// Helpers

function epochToISO8601(epochTime: number): string {
  const date = new Date(epochTime * 1000);
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
