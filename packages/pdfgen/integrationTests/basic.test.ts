import test from "ava";
// import request from 'supertest';
// import {app, server} from '../src/index';
import { receipts } from "@versaprotocol/examples";
import { Org } from "@versaprotocol/schema";
import { pdfToText } from "./helpers";
import { flightSnapshot } from "./snapshots/flight-receipt";
import { createReceiptDoc } from "../src";

const sender: Org = {
  name: "Test Merchant",
  website: "https://example.com",
};

test("receipt PDF with flight data", async (t) => {
  const doc = await createReceiptDoc({
    merchant: sender,
    receipt: receipts.flight,
    brandColor: "#000000",
  });

  const buffer = Buffer.from(doc.output("arraybuffer"));

  const text = await pdfToText(buffer);
  t.true(text.includes("Test Merchant"));
  t.true(text.includes("Apr 16, 2024"));
  t.true(text.includes("Mastercard ··· 4886"));
});

// Purposefully brittle
// this should test if any significant changes are made to content or ordering in the pdf
test("snapshot flight receipt", async (t) => {
  const doc = await createReceiptDoc({
    merchant: sender,
    receipt: receipts.flight,
    brandColor: "#000000",
  });

  const buffer = Buffer.from(doc.output("arraybuffer"));

  const text = await pdfToText(buffer);

  t.is(text, flightSnapshot);
});
