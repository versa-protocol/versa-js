import React from "react";

interface Props {
  bubbleErrorMessage: (err: string) => void;
  children: any;
}

export class StudioErrorBoundary extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    this.props.bubbleErrorMessage(error.message);
  }

  render() {
    if ((this.state as any).hasError) {
      return null;
    }

    return this.props.children;
  }
}
