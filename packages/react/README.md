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

## Best Practices: Error Boundaries

While we take measures to validate data received over the Versa network at the protocol level,
we nonetheless recommend catching runtime errors in an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) when you are using the `ReceiptDisplay` component in a production, user-facing environment.
The `ReceiptDisplay` is a complex component tree, and while we advise earlier validation steps, an error boundary will prevent bad data from crashing your application as a last line of defense.

As an example, here's how we use an error boundary in our [demo studio](https://github.com/versa-protocol/versa-js/blob/ff3744331f94845e9585ae3cd970e052695ce754/apps/demo/src/components/studio/interactiveStudio.tsx#L358-L374)

```jsx
<ReceiptErrorBoundary receipt={parsedReceipt} onError={(e) => log(String(e))}>
  {breakingError && <BrokenReceipt />}
  {!breakingError && (
    <VersaContext.Provider value={{ mapbox_token: process.env.MAPBOX_TOKEN }}>
      <ReceiptDisplay
        receipt={parsedReceipt}
        merchant={parsedMerchant}
        theme={simplifiedTheme}
      />
    </VersaContext.Provider>
  )}
</ReceiptErrorBoundary>
```
