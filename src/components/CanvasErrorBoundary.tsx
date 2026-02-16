import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

const DefaultFallback: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/80 text-center">
    <div className="max-w-xs px-4 py-6">
      <p className="text-sm font-medium text-slate-700">3D scene unavailable</p>
      <p className="mt-2 text-xs text-slate-500">
        Your browser may not support WebGL, or the graphics context was lost. Try refreshing.
      </p>
    </div>
  </div>
);

class CanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[CanvasErrorBoundary] 3D scene crashed:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />;
    }
    return this.props.children;
  }
}

export default CanvasErrorBoundary;
