import test from "ava";
import { Org, Receipt } from "@versa/schema";
import { pdfToText } from "./helpers";
import { createReceiptDoc } from "../src";

const sender: Org = {
  name: "Merchant B",
  website: "https://example.com",
};

import canceledJSON from "./fixtures/canceled.json";

test("canceled receipt", async (t) => {
  const doc = await createReceiptDoc({
    merchant: sender,
    receipt: canceledJSON as unknown as Receipt,
    brandColor: "#000000",
  });

  const buffer = Buffer.from(doc.output("arraybuffer"));

  const text = await pdfToText(buffer);
  t.true(text.includes("Merchant B"), "PDF should include merchant name");
  t.true(
    text.includes("Ticket is cancelled."),
    "PDF should indicate ticket cancellation"
  );
});
