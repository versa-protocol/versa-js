"use client";
import { ReceiptDisplay, VersaContext } from "@versaprotocol/react";
import { receipts, senders } from "samples";

export const DemoReceipt = () => {
  return (
    <VersaContext.Provider value={{ mapbox_token: process.env.MAPBOX_TOKEN }}>
      <ReceiptDisplay merchant={senders.bend} receipt={receipts.simple} />
    </VersaContext.Provider>
  );
};
