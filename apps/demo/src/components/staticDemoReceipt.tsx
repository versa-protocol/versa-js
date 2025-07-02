"use client";
import { ReceiptDisplay, VersaContext } from "@versa/react";
import { receipts, senders } from "@versa/examples";

export const DemoReceipt = () => {
  return (
    <VersaContext.Provider value={{ mapbox_token: process.env.MAPBOX_TOKEN }}>
      <ReceiptDisplay merchant={senders.bend} receipt={receipts.lodging} />
    </VersaContext.Provider>
  );
};
