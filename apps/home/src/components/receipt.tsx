"use client";
import { ReceiptDisplay } from "@versaprotocol/react";
import { receipts, senders } from "samples";

export const DemoReceipt = () => {
  return (
    <ReceiptDisplay merchant={senders.bend} receipt={receipts.subscription} />
  );
};
