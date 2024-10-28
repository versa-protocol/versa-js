"use client";
import { ReceiptDisplay, VersaContext } from "@versaprotocol/react";
import { receipts, senders } from "examples";

export const DemoReceipt = () => {
  return (
    <VersaContext.Provider value={{ mapbox_token: process.env.MAPBOX_TOKEN }}>
      <ReceiptDisplay
        merchant={senders.bend}
        receipt={receipts.lodging}
        schemaVersion="1.5.1"
      />
    </VersaContext.Provider>
  );
};
