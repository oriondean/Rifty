import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-card border border-destructive rounded-xl p-8 text-center space-y-4">
                        <div className="text-destructive text-4xl font-bold">⚠️</div>
                        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
                        <p className="text-muted-foreground">
                            The application encountered an unexpected error. Please refresh the page to continue.
                        </p>
                        {this.state.error && (
                            <details className="text-left text-xs text-muted-foreground bg-muted p-4 rounded">
                                <summary className="cursor-pointer font-medium">Error details</summary>
                                <pre className="mt-2 overflow-auto">{this.state.error.message}</pre>
                            </details>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
