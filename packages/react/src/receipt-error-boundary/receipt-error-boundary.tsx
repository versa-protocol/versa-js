import { Receipt } from "@versaprotocol/schema";
import { BrokenReceipt } from "../broken-receipt";
import React from "react";

export class ReceiptErrorBoundary extends React.Component<
  {
    receipt: Receipt;
    children: React.ReactNode;
    onError?: (error: Error) => void;
  },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: {
    receipt: Receipt;
    children: React.ReactNode;
  }) {
    if (this.state.hasError && prevProps.receipt !== this.props.receipt) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <BrokenReceipt />;
    }
    return this.props.children;
  }
}
