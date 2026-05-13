import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center bg-surface p-12 text-center">
          <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Something went wrong</h2>
          <p className="text-on-surface-variant max-w-md mx-auto mb-2 font-body-base leading-relaxed">
            {this.state.error.message || 'An unexpected render error occurred.'}
          </p>
          <p className="text-[11px] text-outline mb-8">Open the browser console for details.</p>
          <button
            type="button"
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
            className="px-8 py-2 bg-primary text-on-primary font-label-caps rounded shadow-sm hover:opacity-90"
          >
            Start Over
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
