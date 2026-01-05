import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught error:', error, info);
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div className="p-6 bg-red-50 text-red-800">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <div className="mt-3 whitespace-pre-wrap text-sm">{String(error && error.toString())}</div>
          {info && info.componentStack && (
            <details className="mt-3 text-xs text-gray-700"><summary>Stack trace</summary><pre className="text-xs">{info.componentStack}</pre></details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
