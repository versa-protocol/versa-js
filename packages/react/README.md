# Versa React Component Library

This package exports React components for displaying decrypted Versa receipts

## Get Started

To install the package, run:

```bash
    npm i @versaprotocol/react
```

## Usage

The best way to use the Versa React library is to plug your data into the `ReceiptDisplay` component. The merchant is a Versa `Org` object; likely the sender returned by the registry. The receipt is the decrypted payload received from the sender.

```jsx
import { ReceiptDisplay, VersaContext } from "@versaprotocol/react";
import { receipts, senders } from "data";

export const Receipt = () => {
  return <ReceiptDisplay merchant={senders.bend} receipt={receipts.lodging} />;
};
```

If you want to take advantage of inline maps powered by Mapbox, you can provide a token via the Versa Context Provider

```jsx
import { ReceiptDisplay, VersaContext } from "@versaprotocol/react";
import { receipts, senders } from "data";

export const Receipt = () => {
  return (
    <VersaContext.Provider value={{ mapbox_token: process.env.MAPBOX_TOKEN }}>
      <ReceiptDisplay merchant={senders.bend} receipt={receipts.lodging} />
    </VersaContext.Provider>
  );
};
```
