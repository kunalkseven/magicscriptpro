"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#06070B] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-[var(--text-muted)] max-w-md mb-8">
            We encountered an unexpected error. Don&apos;t worry, your data is safe. 
            Try refreshing the page or head back home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Refresh Page
            </button>
            <Link href="/" className="btn btn-secondary flex items-center justify-center gap-2">
              <Home size={18} />
              Back to Home
            </Link>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-10 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-left max-w-2xl overflow-auto">
              <p className="text-red-400 font-mono text-xs">{this.state.error?.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
